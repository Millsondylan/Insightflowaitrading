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
    <Div className="container mx-auto py-6">
      <Div className="mb-6">
        <H1 className="text-3xl font-bold mb-2">Lovable.dev Editor Suite</Div>
        <P className="text-text-muted">Powerful visual editing and tech integration tools for Lovable.dev</P>
      </Div>
      
      <Tabs defaultValue="visual-editor" className="w-full" onValueChange={setActiveTab} />
        <Div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="visual-editor" />Visual Editor</Tabs>
            <TabsTrigger value="converter" />Convert Components</TabsTrigger>
            <TabsTrigger value="next-converter" />Next.js Migration</TabsTrigger>
            <TabsTrigger value="github" />GitHub Integration</TabsTrigger>
            <TabsTrigger value="supabase" />Supabase</TabsTrigger>
          </TabsList>
          
          <Button size="sm" variant="outline" />
            Documentation
          </Button>
        </Div>
        
        <Card className="mb-6" />
          <TabsContent value="visual-editor" className="p-0 m-0" />
            <Div className="p-6">
              <LovablePreview sourceCode={`<Div className="sample-component" />
  <H2>Sample Component</Card>
  <P>Edit this component using the visual editor</P>
</Div>`}
                onEdit={(id, changes) => {
                  console.log('Edit component', id, changes);
                }}
              />
            </Div>
          </TabsContent>
          
          <TabsContent value="converter" className="p-0 m-0" />
            <Div className="p-6">
              <LovableConverter />
            </TabsContent>
          </TabsContent>
          
          <TabsContent value="next-converter" className="p-0 m-0" />
            <Div className="p-6">
              <LovableNextConverter />
            </TabsContent>
          </TabsContent>
          
          <TabsContent value="github" className="p-0 m-0" />
            <Div className="p-6">
              <GitHubSync />
            </TabsContent>
          </TabsContent>
          
          <TabsContent value="supabase" className="p-0 m-0" />
            <Div className="p-6">
              <supabaseAdapter />
            </TabsContent>
          </TabsContent>
        </Card>
        
        <Card className="p-6" />
          <H2 className="text-xl font-bold mb-4">About {activeTab === 'visual-editor' ? 'Visual Editor' : 
            activeTab === 'converter' ? 'Component Converter' : 
            activeTab === 'next-converter' ? 'Next.js Migration' :
            activeTab === 'github' ? 'GitHub Integration' : 
            'Supabase Integration'}
          </Card>
          
          {activeTab === 'visual-editor' && (
            <Div className="text-text-muted space-y-4">
              <P>The Visual Editor allows you to make precise modifications to your components directly in the browser, 
              without having to modify code manually. This feature is powered by Lovable.dev's Visual Edits system.</Div>
              
              <P>You can edit text content, styling properties, and component structure with intuitive controls. 
              All changes are instantly previewed and can be saved as clean, production-ready code.</P>
              
              <Div className="flex gap-2">
                <Button variant="outline" size="sm" />Learn More</Div>
                <Button size="sm" />Try Visual Editing</Button>
              </Div>
            </Div>
          )}
          
          {activeTab === 'converter' && (
            <Div className="text-text-muted space-y-4">
              <P>The Component Converter transforms your regular React components into Lovable.dev compatible components.
              This tool automatically adds the necessary metadata and structure for visual editing capabilities.</Div>
              
              <P>You can convert individual components or entire directories at once, making it easy to migrate
              existing projects to the Lovable ecosystem.</P>
              
              <Div className="flex gap-2">
                <Button variant="outline" size="sm" />View Docs</Div>
                <Button size="sm" />Convert Components</Button>
              </Div>
            </Div>
          )}
          
          {activeTab === 'next-converter' && (
            <Div className="text-text-muted space-y-4">
              <P>The Next.js Migration tool allows you to transform your Lovable React app into a fully-featured Next.js application.
              This unlocks benefits like server-side rendering, improved SEO, and enhanced performance.</Div>
              
              <P>The migration process preserves your component structure while adding Next.js specific features like App Router.</P>
              
              <Div className="flex gap-2">
                <Button variant="outline" size="sm" />Migration Guide</Div>
                <Button size="sm" />Start Migration</Button>
              </Div>
            </Div>
          )}
          
          {activeTab === 'github' && (
            <Div className="text-text-muted space-y-4">
              <P>The GitHub Integration enables seamless version control for your Lovable projects. You can sync your components
              with GitHub repositories, track changes, and collaborate with team members.</Div>
              
              <P>This integration supports GitHub workflows, pull requests, and branch management, making it perfect for team collaboration.</P>
              
              <Div className="flex gap-2">
                <Button variant="outline" size="sm" />GitHub Setup Guide</Div>
                <Button size="sm" />Connect Repository</Button>
              </Div>
            </Div>
          )}
          
          {activeTab === 'supabase' && (
            <Div className="text-text-muted space-y-4">
              <P>The Supabase Integration provides a complete backend solution for your Lovable applications. Connect your project
              to Supabase for database, authentication, and serverless functions.</Div>
              
              <P>This integration automatically sets up the necessary tables, functions, and authentication providers for your application.</P>
              
              <Div className="flex gap-2">
                <Button variant="outline" size="sm" />Supabase Guide</Div>
                <Button size="sm" />Connect Database</Button>
              </Div>
            </Div>
          )}
        </Card>
      </Tabs>
    </Div>
  );
};

// Add Lovable.dev compatibility
export const lovable = {
  editableComponents: true,
  visualEditing: true,
  supportsTailwind: true
};

export default LovableEditorPage;
