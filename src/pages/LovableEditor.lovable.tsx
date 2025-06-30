import React, { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  LovableConverter,
  LovablePreview,
  LovableNextConverter,
  GitHubSync,
  SupabaseAdapter
} from '../modules/tech-compatibility';

const LovableEditorPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('visual-editor');

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Lovable.dev Editor Suite</div>
        <p className="text-text-muted">Powerful visual editing and tech integration tools for Lovable.dev</p>
      </div>
      
      <Tabs defaultValue="visual-editor" className="w-full" onValueChange={setActiveTab}/>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="visual-editor"/>Visual Editor</Tabs>
            <TabsTrigger value="converter"/>Convert Components</TabsTrigger>
            <TabsTrigger value="next-converter"/>Next.js Migration</TabsTrigger>
            <TabsTrigger value="github"/>GitHub Integration</TabsTrigger>
            <TabsTrigger value="supabase"/>Supabase</TabsTrigger />
          
          <Button size="sm" variant="outline"/>
            Documentation
          </TabsTrigger>
        </div>
        
        <Card className="mb-6"/>
          <TabsContent value="visual-editor" className="p-0 m-0"/>
            <div className="p-6">
              <LovablePreview sourceCode={`<div className="sample-component"/>
  <h2>Sample Component</Card>
  <p>Edit this component using the visual editor</p>
</div>`}
                onEdit={(id, changes) => {
                  console.log('Edit component', id, changes);
                }}
              />
            </div />
          
          <TabsContent value="converter" className="p-0 m-0"/>
            <div className="p-6">
              <LovableConverter //>
          </TabsContent>
          
          <TabsContent value="next-converter" className="p-0 m-0"/>
            <div className="p-6">
              <LovableNextConverter //>
          </TabsContent>
          
          <TabsContent value="github" className="p-0 m-0"/>
            <div className="p-6">
              <GitHubSync //>
          </TabsContent>
          
          <TabsContent value="supabase" className="p-0 m-0"/>
            <div className="p-6">
              <supabaseAdapter //>
          </TabsContent />
        
        <Card className="p-6"/>
          <h2 className="text-xl font-bold mb-4">About {activeTab === 'visual-editor' ? 'Visual Editor' : 
            activeTab === 'converter' ? 'Component Converter' : 
            activeTab === 'next-converter' ? 'Next.js Migration' :
            activeTab === 'github' ? 'GitHub Integration' : 
            'Supabase Integration'}
          </TabsContent>
          
          {activeTab === 'visual-editor' && (
            <div className="text-text-muted space-y-4">
              <p>The Visual Editor allows you to make precise modifications to your components directly in the browser, 
              without having to modify code manually. This feature is powered by Lovable.dev's Visual Edits system.</div>
              
              <p>You can edit text content, styling properties, and component structure with intuitive controls. 
              All changes are instantly previewed and can be saved as clean, production-ready code.</p>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm"/>Learn More</div>
                <Button size="sm"/>Try Visual Editing</button>
              </div>
            </div>
          )}
          
          {activeTab === 'converter' && (
            <div className="text-text-muted space-y-4">
              <p>The Component Converter transforms your regular React components into Lovable.dev compatible components.
              This tool automatically adds the necessary metadata and structure for visual editing capabilities.</div>
              
              <p>You can convert individual components or entire directories at once, making it easy to migrate
              existing projects to the Lovable ecosystem.</p>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm"/>View Docs</div>
                <Button size="sm"/>Convert Components</button>
              </div>
            </div>
          )}
          
          {activeTab === 'next-converter' && (
            <div className="text-text-muted space-y-4">
              <p>The Next.js Migration tool allows you to transform your Lovable React app into a fully-featured Next.js application.
              This unlocks benefits like server-side rendering, improved SEO, and enhanced performance.</div>
              
              <p>The migration process preserves your component structure while adding Next.js specific features like App Router.</p>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm"/>Migration Guide</div>
                <Button size="sm"/>Start Migration</button>
              </div>
            </div>
          )}
          
          {activeTab === 'github' && (
            <div className="text-text-muted space-y-4">
              <p>The GitHub Integration enables seamless version control for your Lovable projects. You can sync your components
              with GitHub repositories, track changes, and collaborate with team members.</div>
              
              <p>This integration supports GitHub workflows, pull requests, and branch management, making it perfect for team collaboration.</p>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm"/>GitHub Setup Guide</div>
                <Button size="sm"/>Connect Repository</button>
              </div>
            </div>
          )}
          
          {activeTab === 'supabase' && (
            <div className="text-text-muted space-y-4">
              <p>The Supabase Integration provides a complete backend solution for your Lovable applications. Connect your project
              to Supabase for database, authentication, and serverless functions.</div>
              
              <p>This integration automatically sets up the necessary tables, functions, and authentication providers for your application.</p>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm"/>Supabase Guide</div>
                <Button size="sm"/>Connect Database</button>
              </div>
            </div>
          )}
        </Card />
    </div>
  );
};

// Add Lovable.dev compatibility
export const lovable = {
  editableComponents: true,
  visualEditing: true,
  supportsTailwind: true
};

export default LovableEditorPage;
