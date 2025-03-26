"use server"
import { chartDictionary } from '@/components/chat/charts/index';
import { NextRequest, NextResponse } from 'next/server';




export async function GET(req: NextRequest) {  
  return NextResponse.json(chartDictionary);
}