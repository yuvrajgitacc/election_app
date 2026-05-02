import React from 'react';

interface PageProps {
  params: Promise<{ country: string; slug: string }>;
}

export default async function TopicPage({ params }: PageProps) {
  const { country, slug } = await params;
  return (
    <div className="p-8">
      <h1>Topic: {slug} in {country}</h1>
    </div>
  );
}
