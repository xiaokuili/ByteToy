"use client";

import React, { useEffect, useState } from "react";

import { Database, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Datasource } from "@/types/base";
import { getMetadatas } from "@/lib/datasource-action";

export async function DatabaseManagementComponent() {
  return (
    <div className='container mx-auto px-4 py-8'>
      <header className='flex justify-between items-center mb-8'>
        <div className='flex items-center space-x-2'>
          <Database className='w-8 h-8 text-blue-500' />
          <h1 className='text-2xl font-semibold text-gray-800'>数据库</h1>
        </div>
        <Button variant='ghost' className='text-blue-500 hover:text-blue-600'>
          <BookOpen className='w-5 h-5 mr-2' />
          Learn about our data
        </Button>
      </header>
      <DatabaseCard />
    </div>
  );
}

function DatabaseCard() {
  const [metadatas, setMetadatas] = useState<Metadata[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMetadata() {
      try {
        const result = await getMetadatas();
        if (result.success) {
          setMetadatas(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch metadata:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchMetadata();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
      {metadatas.map((metadata) => (
        <Card
          key={metadata.id}
          className='hover:shadow-lg transition-shadow duration-300'
        >
          <CardContent className='p-6'>
            <Database className='w-12 h-12 text-purple-500 mb-4' />
            <h2 className='text-lg font-medium text-gray-800'>
              {metadata.displayName}
            </h2>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
