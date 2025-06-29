import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Book, MessageSquare, Lightbulb, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function HelpPage() {
  return (
    <Div className="container mx-auto p-6">
      <Div className="flex items-center justify-between mb-8">
        <Div>
          <H1 className="text-3xl font-bold text-white">Help Center</Div>
          <P className="text-gray-400">Find answers and get support</P>
        </Div>
        <Div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search help articles..."
            className="pl-10"
          />
        </Div>
      </Div>

      <Div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <Div className="flex items-center gap-2">
              <Book className="h-5 w-5 text-blue-400" />
              <CardTitle>Documentation</Div>
            </Div>
          </CardHeader>
          <CardContent>
            <P className="text-gray-400 mb-4">
              Comprehensive guides and tutorials to help you get started
            </CardContent>
            <Button variant="outline" className="w-full" />
              Browse Docs
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-purple-400" />
              <CardTitle>Community</Card>
            </Div>
          </CardHeader>
          <CardContent>
            <P className="text-gray-400 mb-4">
              Join our community to discuss strategies and get help
            </CardContent>
            <Button variant="outline" className="w-full" />
              Join Discussion
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-400" />
              <CardTitle>Tips & Tricks</Card>
            </Div>
          </CardHeader>
          <CardContent>
            <P className="text-gray-400 mb-4">
              Learn best practices and advanced techniques
            </CardContent>
            <Button variant="outline" className="w-full" />
              View Tips
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </Div>

      <Card>
        <CardContent className="p-8" />
          <Div className="text-center">
            <H2 className="text-2xl font-bold text-white mb-2"></Card></Card>Need More Help?</Card>
            <P className="text-gray-400 mb-6">
              Our support team is available 24/7 to assist you with any questions
            </P>
            <Button className="bg-blue-600 hover:bg-blue-700"></Button>
              Contact Support
            </Button>
          </Div>
        </CardContent>
      </Card>
    </Div>
  );
}

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
