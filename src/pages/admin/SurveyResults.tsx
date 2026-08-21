import React, { useCallback, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import SEO from '@/components/SEO';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ArrowLeft, Download, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Survey, SurveyQuestion, questionTypeLabels } from '@/types/SurveyTypes';

interface ResponseRow {
  id: string;
  respondent_name: string;
  respondent_email: string;
  submitted_at: string;
}

interface AnswerRow {
  response_id: string;
  question_id: string;
  answer_text: string | null;
  answer_options: string[];
  answer_number: number | null;
}

const SurveyResults: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [questions, setQuestions] = useState<SurveyQuestion[]>([]);
  const [responses, setResponses] = useState<ResponseRow[]>([]);
  const [answers, setAnswers] = useState<AnswerRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);

    const [surveyRes, questionsRes, responsesRes] = await Promise.all([
      supabase.from('surveys').select('*').eq('id', id).maybeSingle(),
      supabase
        .from('survey_questions')
        .select('*')
        .eq('survey_id', id)
        .order('question_order', { ascending: true }),
      supabase
        .from('survey_responses')
        .select('id, respondent_name, respondent_email, submitted_at')
        .eq('survey_id', id)
        .order('submitted_at', { ascending: false }),
    ]);

    if (surveyRes.error || !surveyRes.data) {
      toast({ title: 'Survei tidak ditemukan', variant: 'destructive' });
      setIsLoading(false);
      return;
    }

    setSurvey(surveyRes.data as Survey);
    setQuestions(((questionsRes.data ?? []) as any[]).map((q) => ({
      ...q,
      options: Array.isArray(q.options) ? q.options : [],
    })) as SurveyQuestion[]);
    const responseRows = (responsesRes.data ?? []) as ResponseRow[];
    setResponses(responseRows);

    if (responseRows.length > 0) {
      const { data: answerRows } = await supabase
        .from('survey_answers')
        .select('response_id, question_id, answer_text, answer_options, answer_number')
        .in(
          'response_id',
          responseRows.map((r) => r.id)
        );
      setAnswers(
        ((answerRows ?? []) as any[]).map((a) => ({
          ...a,
          answer_options: Array.isArray(a.answer_options) ? a.answer_options : [],
        })) as AnswerRow[]
      );
    } else {
      setAnswers([]);
    }

    setIsLoading(false);
  }, [id, toast]);

  useEffect(() => {
    load();
  }, [load]);

  const answerFor = (responseId: string, questionId: string) =>
    answers.find((a) => a.response_id === responseId && a.question_id === questionId);

  const formatAnswer = (answer?: AnswerRow) => {
    if (!answer) return '';
    if (answer.answer_options.length > 0) return answer.answer_options.join(', ');
    if (answer.answer_number !== null) return String(answer.answer_number);
    return answer.answer_text ?? '';
  };

  const handleExportCsv = () => {
    if (!survey) return;
    const header = ['Nama', 'Email', 'Waktu', ...questions.map((q) => q.question_text)];
    const rows = responses.map((response) => [
      response.respondent_name,
      response.respondent_email,
      new Date(response.submitted_at).toLocaleString('id-ID'),
      ...questions.map((q) => formatAnswer(answerFor(response.id, q.id))),
    ]);

    const escape = (value: string) => `"${(value ?? '').replace(/"/g, '""')}"`;
    const csv = [header, ...rows].map((row) => row.map((cell) => escape(String(cell))).join(',')).join('\n');

    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `survei-${survey.slug}-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <AdminLayout title="Hasil Survei">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  if (!survey) {
    return (
      <AdminLayout title="Hasil Survei">
        <p className="text-muted-foreground">Survei tidak ditemukan.</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Hasil Survei">
      <SEO title={`Hasil ${survey.title} - Admin`} description="Hasil survei" />

      <div className="mb-4">
        <Button variant="ghost" asChild>
          <Link to="/admin/survey">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke daftar survei
          </Link>
        </Button>
      </div>

      <AdminPageHeader
        title={survey.title}
        description={`${responses.length} respons masuk • ${questions.length} pertanyaan`}
      >
        <Button variant="outline" onClick={handleExportCsv} disabled={responses.length === 0}>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </AdminPageHeader>

      <div className="space-y-6">
        {questions.map((question, index) => {
          const questionAnswers = answers.filter((a) => a.question_id === question.id);

          return (
            <Card key={question.id}>
              <CardHeader>
                <CardTitle className="text-base">
                  {index + 1}. {question.question_text}
                </CardTitle>
                <CardDescription className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline">{questionTypeLabels[question.question_type]}</Badge>
                  <span>{questionAnswers.length} jawaban</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                {question.question_type === 'radio' || question.question_type === 'checkbox' ? (
                  <div className="space-y-3">
                    {question.options.map((option) => {
                      const count = questionAnswers.filter((a) =>
                        a.answer_options.includes(option)
                      ).length;
                      const percentage =
                        questionAnswers.length > 0
                          ? Math.round((count / questionAnswers.length) * 100)
                          : 0;
                      return (
                        <div key={option} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{option}</span>
                            <span className="text-muted-foreground">
                              {count} ({percentage}%)
                            </span>
                          </div>
                          <Progress value={percentage} />
                        </div>
                      );
                    })}
                  </div>
                ) : question.question_type === 'scale' ? (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Rata-rata:{' '}
                      <span className="font-medium text-foreground">
                        {questionAnswers.length > 0
                          ? (
                              questionAnswers.reduce((sum, a) => sum + (a.answer_number ?? 0), 0) /
                              questionAnswers.length
                            ).toFixed(2)
                          : '-'}
                      </span>{' '}
                      dari {question.scale_max}
                    </p>
                    {Array.from(
                      { length: question.scale_max - question.scale_min + 1 },
                      (_, i) => question.scale_min + i
                    ).map((value) => {
                      const count = questionAnswers.filter((a) => a.answer_number === value).length;
                      const percentage =
                        questionAnswers.length > 0
                          ? Math.round((count / questionAnswers.length) * 100)
                          : 0;
                      return (
                        <div key={value} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{value}</span>
                            <span className="text-muted-foreground">
                              {count} ({percentage}%)
                            </span>
                          </div>
                          <Progress value={percentage} />
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="space-y-2 max-h-72 overflow-y-auto">
                    {questionAnswers.length === 0 ? (
                      <p className="text-sm text-muted-foreground">Belum ada jawaban.</p>
                    ) : (
                      questionAnswers.map((a, i) => (
                        <p key={i} className="rounded-md bg-muted/50 p-3 text-sm">
                          {a.answer_text}
                        </p>
                      ))
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Daftar Responden</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {responses.length === 0 ? (
              <p className="py-10 text-center text-sm text-muted-foreground">
                Belum ada respons masuk.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Waktu</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {responses.map((response) => (
                      <TableRow key={response.id}>
                        <TableCell className="font-medium">{response.respondent_name}</TableCell>
                        <TableCell>{response.respondent_email}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(response.submitted_at).toLocaleString('id-ID')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default SurveyResults;
