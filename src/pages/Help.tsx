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
          <h1 className="text-3xl font-bold text-white">Help Center</div>
          <p className="text-gray-400">Find answers and get support</p>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
          <Input
            type="text"
            placeholder="Search help articles..."
            className="pl-10"/>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Book className="h-5 w-5 text-blue-400"/>
              <CardTitle>Documentation</div>
            </div>
          <CardContent>
            <p className="text-gray-400 mb-4">
              Comprehensive guides and tutorials to help you get started
            </CardContent>
            <Button variant="outline" className="w-full"/>
              Browse Docs
              <arrowRight className="ml-2 h-4 w-4"/>
            </button>
        </button>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-purple-400"/>
              <CardTitle>Community</Card>
            </div>
          <CardContent>
            <p className="text-gray-400 mb-4">
              Join our community to discuss strategies and get help
            </CardContent>
            <Button variant="outline" className="w-full"/>
              Join Discussion
              <arrowRight className="ml-2 h-4 w-4"/>
            </button>
        </button>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <lightbulb className="h-5 w-5 text-yellow-400"/>
              <CardTitle>Tips & Tricks</Card>
            </div>
          <CardContent>
            <p className="text-gray-400 mb-4">
              Learn best practices and advanced techniques
            </CardContent>
            <Button variant="outline" className="w-full"/>
              View Tips
              <arrowRight className="ml-2 h-4 w-4"/>
            </button>
        </button>
      </div>

      <Card>
        <CardContent className="p-8"/>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2"/></Card></Card>Need More Help?</Card>
            <p className="text-gray-400 mb-6">
              Our support team is available 24/7 to assist you with any questions
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700"></button>
              Contact Support
            </button>
          </div>
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
