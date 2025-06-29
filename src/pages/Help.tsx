import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Book, MessageSquare, Lightbulb, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function HelpPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Help Center</h1>
          <p className="text-gray-400">Find answers and get support</p>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search help articles..."
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Book className="h-5 w-5 text-blue-400" />
              <CardTitle>Documentation</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400 mb-4">
              Comprehensive guides and tutorials to help you get started
            </p>
            <Button variant="outline" className="w-full">
              Browse Docs
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-purple-400" />
              <CardTitle>Community</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400 mb-4">
              Join our community to discuss strategies and get help
            </p>
            <Button variant="outline" className="w-full">
              Join Discussion
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-400" />
              <CardTitle>Tips & Tricks</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400 mb-4">
              Learn best practices and advanced techniques
            </p>
            <Button variant="outline" className="w-full">
              View Tips
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Need More Help?</h2>
            <p className="text-gray-400 mb-6">
              Our support team is available 24/7 to assist you with any questions
            </p>
            <button className="bg-blue-600 hover:bg-blue-700">
              Contact Support
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
