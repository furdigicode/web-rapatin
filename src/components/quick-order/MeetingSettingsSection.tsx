import { ChevronDown, Settings } from "lucide-react";
import { Control } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface MeetingSettingsFormValues {
  meeting_topic: string;
  custom_passcode: string;
  is_meeting_registration: boolean;
  is_meeting_qna: boolean;
  is_language_interpretation: boolean;
  is_mute_upon_entry: boolean;
  is_req_unmute_permission: boolean;
}

interface MeetingSettingsSectionProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
}

export function MeetingSettingsSection({ control }: MeetingSettingsSectionProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="meeting_topic"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Topik Meeting</FormLabel>
            <FormControl>
              <Input 
                placeholder="Contoh: Team Meeting Weekly" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="custom_passcode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Passcode (Opsional)</FormLabel>
            <FormControl>
              <Input 
                placeholder="Contoh: 123456" 
                maxLength={10}
                {...field} 
              />
            </FormControl>
            <FormDescription>
              Kosongkan untuk auto-generate passcode
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <Collapsible className="border rounded-lg">
        <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-muted/50 transition-colors">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            <span className="font-medium text-sm">Pengaturan Meeting Lanjutan</span>
          </div>
          <ChevronDown className="w-4 h-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </CollapsibleTrigger>
        <CollapsibleContent className="px-4 pb-4 space-y-4">
          <FormField
            control={control}
            name="is_meeting_registration"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel className="text-sm">Registrasi Peserta</FormLabel>
                  <FormDescription className="text-xs">
                    Peserta harus mendaftar sebelum join meeting
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="is_meeting_qna"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel className="text-sm">Fitur Q&A</FormLabel>
                  <FormDescription className="text-xs">
                    Aktifkan sesi tanya jawab dalam meeting
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="is_language_interpretation"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel className="text-sm">Interpretasi Bahasa</FormLabel>
                  <FormDescription className="text-xs">
                    Aktifkan fitur penerjemahan bahasa
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="is_mute_upon_entry"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel className="text-sm">Mute Saat Masuk</FormLabel>
                  <FormDescription className="text-xs">
                    Peserta otomatis di-mute saat join meeting
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="is_req_unmute_permission"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel className="text-sm">Minta Izin Unmute</FormLabel>
                  <FormDescription className="text-xs">
                    Peserta harus minta izin untuk unmute
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
