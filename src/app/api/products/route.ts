import { NextResponse } from 'next/server';
import { getProducts, createProduct } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('category');
    const search = searchParams.get('search')?.toLowerCase();
    const dietary = searchParams.get('dietary');
    const sort = searchParams.get('sort');

    let products = await getProducts();

    if (categoryId && categoryId !== 'all') {
      products = products.filter((p) => p.categoryId === categoryId);
    }

    if (search) {
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(search) ||
          p.description.toLowerCase().includes(search)
      );
    }

    if (dietary && dietary !== 'all') {
      products = products.filter((p) => p.dietaryType === dietary);
    }

    if (sort === 'price-low') {
      products.sort((a, b) => a.basePrice - b.basePrice);
    } else if (sort === 'price-high') {
      products.sort((a, b) => b.basePrice - a.basePrice);
    } else if (sort === 'rating') {
      products.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'bestseller') {
      products.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
    }

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error in GET /api/products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.basePrice || !body.categoryId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const product = await createProduct(body);
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/products:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
