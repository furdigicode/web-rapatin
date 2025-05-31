
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

interface SurveySettingsProps {
  settings: Record<string, any>;
  onSettingsChange: (settings: Record<string, any>) => void;
}

const SurveySettings: React.FC<SurveySettingsProps> = ({ settings, onSettingsChange }) => {
  const updateSettings = (key: string, value: any) => {
    onSettingsChange({
      ...settings,
      [key]: value
    });
  };

  const updateTheme = (key: string, value: string) => {
    onSettingsChange({
      ...settings,
      theme: {
        ...settings.theme,
        [key]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Messages</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="welcome">Welcome Message</Label>
            <Textarea
              id="welcome"
              value={settings.welcome_message || ''}
              onChange={(e) => updateSettings('welcome_message', e.target.value)}
              placeholder="Welcome! Please take a few minutes to complete this survey."
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="thankyou">Thank You Message</Label>
            <Textarea
              id="thankyou"
              value={settings.thank_you_message || ''}
              onChange={(e) => updateSettings('thank_you_message', e.target.value)}
              placeholder="Thank you for completing our survey!"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Response Collection</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="collect-email"
              checked={settings.collect_email || false}
              onCheckedChange={(checked) => updateSettings('collect_email', checked)}
            />
            <Label htmlFor="collect-email">Collect respondent email</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="collect-name"
              checked={settings.collect_name || false}
              onCheckedChange={(checked) => updateSettings('collect_name', checked)}
            />
            <Label htmlFor="collect-name">Collect respondent name</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="allow-anonymous"
              checked={settings.allow_anonymous || false}
              onCheckedChange={(checked) => updateSettings('allow_anonymous', checked)}
            />
            <Label htmlFor="allow-anonymous">Allow anonymous responses</Label>
          </div>
          <Separator />
          <div>
            <Label htmlFor="response-limit">Response Limit (optional)</Label>
            <Input
              id="response-limit"
              type="number"
              value={settings.response_limit || ''}
              onChange={(e) => updateSettings('response_limit', parseInt(e.target.value) || undefined)}
              placeholder="No limit"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Theme & Appearance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="primary-color">Primary Color</Label>
            <Input
              id="primary-color"
              type="color"
              value={settings.theme?.primaryColor || '#3b82f6'}
              onChange={(e) => updateTheme('primaryColor', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="bg-color">Background Color</Label>
            <Input
              id="bg-color"
              type="color"
              value={settings.theme?.backgroundColor || '#ffffff'}
              onChange={(e) => updateTheme('backgroundColor', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="text-color">Text Color</Label>
            <Input
              id="text-color"
              type="color"
              value={settings.theme?.textColor || '#000000'}
              onChange={(e) => updateTheme('textColor', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SurveySettings;
