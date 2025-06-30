
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Unlock, Crown, Zap } from 'lucide-react';

interface AccessStatusProps {
  hasAccess: boolean;
  featureName: string;
  description?: string;
  onUpgrade?: () => void;
}

const AccessStatus = ({ hasAccess, featureName, description, onUpgrade }: AccessStatusProps) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {hasAccess ? (
            <>
              <Unlock className="h-5 w-5 text-green-500" />
              <span>Access Granted</span>
            </>
          ) : (
            <>
              <Lock className="h-5 w-5 text-orange-500" />
              <span>Premium Feature</span>
            </>
          )}
        </CardTitle>
        <CardDescription>
          {description || `${featureName} access status`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="wait">
          {hasAccess ? (
            <motion.div
              key="granted"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-3"
            >
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <Crown className="h-3 w-3 mr-1" />
                  Pro Access
                </Badge>
              </div>
              <p className="text-sm text-gray-600">
                You have full access to {featureName}. Enjoy all premium features!
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="denied"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-3"
            >
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                  <Zap className="h-3 w-3 mr-1" />
                  Upgrade Required
                </Badge>
              </div>
              <p className="text-sm text-gray-600">
                {featureName} is a premium feature. Upgrade to Pro to unlock this functionality.
              </p>
              {onUpgrade && (
                <Button onClick={onUpgrade} className="w-full">
                  Upgrade to Pro
                </Button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default AccessStatus;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
