import { useState, useEffect } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Repeat, CalendarDays, ChevronDown, ChevronUp, Info } from "lucide-react";
import { Control, useWatch, useFormContext } from "react-hook-form";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  calculateRecurringDays,
  getDayLabel,
  getWeekOrdinalLabel,
  validateRecurringParams,
  RecurrenceType,
  EndType,
} from "@/utils/recurringCalculation";

interface RecurringMeetingSectionProps {
  control: Control<any>;
  startDate: Date | undefined;
  startTime: string;
  onRecurringChange: (result: { isRecurring: boolean; totalDays: number; dates: Date[] }) => void;
}

const WEEKDAYS = [
  { value: 1, label: "Min" },
  { value: 2, label: "Sen" },
  { value: 3, label: "Sel" },
  { value: 4, label: "Rab" },
  { value: 5, label: "Kam" },
  { value: 6, label: "Jum" },
  { value: 7, label: "Sab" },
];

export function RecurringMeetingSection({
  control,
  startDate,
  startTime,
  onRecurringChange,
}: RecurringMeetingSectionProps) {
  const { setValue } = useFormContext();

  const [isOpen, setIsOpen] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceType, setRecurrenceType] = useState<RecurrenceType>(1);
  const [repeatInterval, setRepeatInterval] = useState(1);
  const [weeklyDays, setWeeklyDays] = useState<number[]>([]);
  const [monthlyDay, setMonthlyDay] = useState<number>(1);
  const [monthlyWeek, setMonthlyWeek] = useState<number>(1);
  const [monthlyOption, setMonthlyOption] = useState<"day" | "week">("day");
  const [endType, setEndType] = useState<EndType>("end_after_type");
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [endAfterCount, setEndAfterCount] = useState(3);
  const [previewDates, setPreviewDates] = useState<string[]>([]);
  const [totalDays, setTotalDays] = useState(1);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Calculate recurring dates whenever parameters change
  useEffect(() => {
    if (!isRecurring || !startDate) {
      setPreviewDates([]);
      setTotalDays(1);
      onRecurringChange({ isRecurring: false, totalDays: 1, dates: [] });
      return;
    }

    // Validate parameters
    const error = validateRecurringParams({
      startDate,
      recurrenceType,
      repeatInterval,
      endType,
      endDate,
      endAfterCount,
      weeklyDays: recurrenceType === 2 ? weeklyDays : undefined,
      monthlyDay: recurrenceType === 3 && monthlyOption === "day" ? monthlyDay : undefined,
      monthlyWeek: recurrenceType === 3 && monthlyOption === "week" ? monthlyWeek : undefined,
    });

    if (error) {
      setValidationError(error);
      return;
    }

    setValidationError(null);

    const result = calculateRecurringDays({
      startDate,
      startTime,
      recurrenceType,
      repeatInterval,
      endType,
      endDate,
      endAfterCount,
      weeklyDays: recurrenceType === 2 ? weeklyDays : undefined,
      monthlyDay: recurrenceType === 3 && monthlyOption === "day" ? monthlyDay : undefined,
      monthlyWeek: recurrenceType === 3 && monthlyOption === "week" ? monthlyWeek : undefined,
    });

    setPreviewDates(result.formattedDates.slice(0, 10));
    setTotalDays(result.totalDays);
    onRecurringChange({ isRecurring: true, totalDays: result.totalDays, dates: result.dates });

    // Update form values
    setValue("is_recurring", true);
    setValue("recurrence_type", recurrenceType);
    setValue("repeat_interval", repeatInterval);
    setValue("weekly_days", recurrenceType === 2 ? weeklyDays : null);
    setValue("monthly_day", recurrenceType === 3 && monthlyOption === "day" ? monthlyDay : null);
    setValue("monthly_week", recurrenceType === 3 && monthlyOption === "week" ? monthlyWeek : null);
    setValue("end_type", endType);
    setValue("recurrence_end_date", endType === "end_date" ? endDate : null);
    setValue("recurrence_count", endType === "end_after_type" ? endAfterCount : null);
  }, [
    isRecurring,
    startDate,
    startTime,
    recurrenceType,
    repeatInterval,
    weeklyDays,
    monthlyDay,
    monthlyWeek,
    monthlyOption,
    endType,
    endDate,
    endAfterCount,
    setValue,
    onRecurringChange,
  ]);

  // Reset recurring values when toggle is off
  useEffect(() => {
    if (!isRecurring) {
      setValue("is_recurring", false);
      setValue("recurrence_type", null);
      setValue("repeat_interval", null);
      setValue("weekly_days", null);
      setValue("monthly_day", null);
      setValue("monthly_week", null);
      setValue("end_type", null);
      setValue("recurrence_end_date", null);
      setValue("recurrence_count", null);
    }
  }, [isRecurring, setValue]);

  const toggleWeekday = (day: number) => {
    setWeeklyDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort((a, b) => a - b),
    );
  };

  const getIntervalLabel = () => {
    switch (recurrenceType) {
      case 1:
        return "hari";
      case 2:
        return "minggu";
      case 3:
        return "bulan";
    }
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="border rounded-lg">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Repeat className="w-5 h-5 text-primary" />
            </div>
            <div>
              <Label htmlFor="recurring-toggle" className="font-medium cursor-pointer">
                Lebih dari 1 Hari?
              </Label>
              <p className="text-sm text-muted-foreground">
                {isRecurring && totalDays > 1 ? `${totalDays} tanggal meeting` : "Jadwalkan meeting berkala"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Switch
              id="recurring-toggle"
              checked={isRecurring}
              onCheckedChange={(checked) => {
                setIsRecurring(checked);
                if (checked) setIsOpen(true);
              }}
            />
            {isRecurring && (
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </Button>
              </CollapsibleTrigger>
            )}
          </div>
        </div>

        <CollapsibleContent>
          {isRecurring && (
            <div className="px-4 pb-4 space-y-4 border-t pt-4">
              {/* Recurrence Type */}
              <div className="space-y-2">
                <Label>Tipe Pengulangan</Label>
                <div className="flex gap-2">
                  {[
                    { value: 1 as RecurrenceType, label: "Harian" },
                    { value: 2 as RecurrenceType, label: "Mingguan" },
                    { value: 3 as RecurrenceType, label: "Bulanan" },
                  ].map((option) => (
                    <Button
                      key={option.value}
                      type="button"
                      variant={recurrenceType === option.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setRecurrenceType(option.value)}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Repeat Interval */}
              <div className="space-y-2">
                <Label>Setiap</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min={1}
                    max={recurrenceType === 1 ? 99 : recurrenceType === 2 ? 50 : 10}
                    value={repeatInterval}
                    onChange={(e) => setRepeatInterval(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20"
                  />
                  <span className="text-muted-foreground">{getIntervalLabel()}</span>
                </div>
              </div>

              {/* Weekly Days Selection */}
              {recurrenceType === 2 && (
                <div className="space-y-2">
                  <Label>Pada Hari</Label>
                  <div className="flex flex-wrap gap-2">
                    {WEEKDAYS.map((day) => (
                      <Button
                        key={day.value}
                        type="button"
                        variant={weeklyDays.includes(day.value) ? "default" : "outline"}
                        size="sm"
                        className="w-11"
                        onClick={() => toggleWeekday(day.value)}
                      >
                        {day.label}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Monthly Options */}
              {recurrenceType === 3 && (
                <div className="space-y-3">
                  <Label>Pada</Label>
                  <RadioGroup
                    value={monthlyOption}
                    onValueChange={(value) => setMonthlyOption(value as "day" | "week")}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="day" id="monthly-day" />
                      <Label htmlFor="monthly-day" className="flex items-center gap-2 font-normal">
                        Tanggal
                        <Select
                          value={monthlyDay.toString()}
                          onValueChange={(v) => setMonthlyDay(parseInt(v))}
                          disabled={monthlyOption !== "day"}
                        >
                          <SelectTrigger className="w-20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 31 }, (_, i) => (
                              <SelectItem key={i + 1} value={(i + 1).toString()}>
                                {i + 1}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="week" id="monthly-week" />
                      <Label htmlFor="monthly-week" className="flex items-center gap-2 font-normal">
                        Minggu ke-
                        <Select
                          value={monthlyWeek.toString()}
                          onValueChange={(v) => setMonthlyWeek(parseInt(v))}
                          disabled={monthlyOption !== "week"}
                        >
                          <SelectTrigger className="w-28">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5].map((week) => (
                              <SelectItem key={week} value={week.toString()}>
                                {getWeekOrdinalLabel(week)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              )}

              {/* End Type */}
              <div className="space-y-3">
                <Label>Berakhir</Label>
                <RadioGroup value={endType} onValueChange={(value) => setEndType(value as EndType)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="end_after_type" id="end-after" />
                    <Label htmlFor="end-after" className="flex items-center gap-2 font-normal">
                      Setelah
                      <Input
                        type="number"
                        min={2}
                        max={99}
                        value={endAfterCount}
                        onChange={(e) => setEndAfterCount(Math.max(2, parseInt(e.target.value) || 2))}
                        className="w-20"
                        disabled={endType !== "end_after_type"}
                      />
                      kali pertemuan
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="end_date" id="end-date" />
                    <Label htmlFor="end-date" className="flex items-center gap-2 font-normal">
                      Pada tanggal
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={endType !== "end_date"}
                            className={cn(
                              "w-40 justify-start text-left font-normal",
                              !endDate && "text-muted-foreground",
                            )}
                          >
                            <CalendarDays className="mr-2 h-4 w-4" />
                            {endDate ? format(endDate, "d MMM yyyy", { locale: id }) : "Pilih"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={endDate}
                            onSelect={setEndDate}
                            disabled={{ before: startDate || new Date() }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Validation Error */}
              {validationError && (
                <div className="flex items-center gap-2 text-destructive text-sm">
                  <Info className="w-4 h-4" />
                  {validationError}
                </div>
              )}

              {/* Preview */}
              {previewDates.length > 0 && !validationError && (
                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium flex items-center gap-2">
                      <CalendarDays className="w-4 h-4" />
                      Preview Jadwal
                    </span>
                    <Badge variant="secondary">{totalDays} sesi</Badge>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1 max-h-40 overflow-y-auto">
                    {previewDates.map((date, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="w-5 text-xs text-muted-foreground">{index + 1}.</span>
                        {date}, {startTime}
                      </li>
                    ))}
                    {totalDays > 10 && (
                      <li className="text-xs text-muted-foreground pt-1">... dan {totalDays - 10} jadwal lainnya</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          )}
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
