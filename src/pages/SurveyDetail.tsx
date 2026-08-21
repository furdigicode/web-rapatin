import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Check, CheckCircle2, Copy, Gift, Loader2 } from 'lucide-react';
import { sanitizeHtml } from '@/utils/sanitizeHtml';
import { useToast } from '@/hooks/use-toast';
import { Survey, SurveyQuestion } from '@/types/SurveyTypes';
import { getSurveyUserIdentifier } from '@/utils/markdownSurveyParser';


type AnswerValue = { text?: string; options?: string[]; number?: number };

const SurveyDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [questions, setQuestions] = useState<SurveyQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const sanitizedTerms = useMemo(
    () => (survey?.reward_terms ? sanitizeHtml(survey.reward_terms) : ''),
    [survey?.reward_terms]
  );

  const handleCopyCode = async () => {
    if (!survey?.reward_code) return;
    try {
      await navigator.clipboard.writeText(survey.reward_code);
      setIsCopied(true);
      toast({ title: 'Kode disalin' });
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      toast({ title: 'Gagal menyalin kode', variant: 'destructive' });
    }
  };


  useEffect(() => {
    const load = async () => {
      if (!slug) return;
      setIsLoading(true);

      const { data: surveyRow } = await supabase
        .from('surveys')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (!surveyRow) {
        setNotFound(true);
        setIsLoading(false);
        return;
      }

      setSurvey(surveyRow as Survey);

      const { data: questionRows } = await supabase
        .from('survey_questions')
        .select('*')
        .eq('survey_id', surveyRow.id)
        .order('question_order', { ascending: true });

      setQuestions(
        ((questionRows ?? []) as any[]).map((q) => ({
          ...q,
          options: Array.isArray(q.options) ? q.options : [],
        })) as SurveyQuestion[]
      );

      if (localStorage.getItem(`survey_submitted_${surveyRow.id}`)) {
        setIsSubmitted(true);
      }

      setIsLoading(false);
    };
    load();
  }, [slug]);

  const isClosed = useMemo(() => {
    if (!survey) return false;
    if (survey.status !== 'active') return true;
    const now = new Date();
    if (survey.start_date && new Date(survey.start_date) > now) return true;
    if (survey.end_date && new Date(survey.end_date) < now) return true;
    return false;
  }, [survey]);

  const setAnswer = (questionId: string, value: AnswerValue) =>
    setAnswers((prev) => ({ ...prev, [questionId]: { ...prev[questionId], ...value } }));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!survey) return;

    if (!name.trim()) {
      toast({ title: 'Nama wajib diisi', variant: 'destructive' });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      toast({ title: 'Email tidak valid', variant: 'destructive' });
      return;
    }

    for (const question of questions) {
      if (!question.is_required) continue;
      const answer = answers[question.id];
      const empty =
        !answer ||
        (question.question_type === 'text' || question.question_type === 'textarea'
          ? !answer.text?.trim()
          : question.question_type === 'scale'
          ? answer.number === undefined
          : !(answer.options && answer.options.length > 0));
      if (empty) {
        toast({
          title: 'Pertanyaan wajib belum dijawab',
          description: question.question_text,
          variant: 'destructive',
        });
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const payload = {
        survey_id: survey.id,
        respondent_name: name.trim(),
        respondent_email: email.trim(),
        user_identifier: getSurveyUserIdentifier(),
        answers: questions.map((question) => {
          const answer = answers[question.id] ?? {};
          return {
            question_id: question.id,
            answer_text: answer.text ?? null,
            answer_options: answer.options ?? [],
            answer_number: answer.number ?? null,
          };
        }),
      };

      const { data, error } = await supabase.functions.invoke('submit-survey', { body: payload });

      if (error || data?.error) {
        toast({
          title: 'Gagal mengirim',
          description: data?.error ?? 'Terjadi kesalahan, coba lagi.',
          variant: 'destructive',
        });
        return;
      }

      localStorage.setItem(`survey_submitted_${survey.id}`, '1');
      setIsSubmitted(true);
      toast({ title: 'Terima kasih!', description: 'Jawaban Anda sudah kami terima.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderQuestion = (question: SurveyQuestion, index: number) => {
    const answer = answers[question.id] ?? {};

    return (
      <div key={question.id} className="space-y-3 rounded-lg border p-4">
        <Label className="text-base font-medium">
          {index + 1}. {question.question_text}
          {question.is_required && <span className="ml-1 text-destructive">*</span>}
        </Label>

        {question.question_type === 'text' && (
          <Input
            value={answer.text ?? ''}
            onChange={(e) => setAnswer(question.id, { text: e.target.value })}
            maxLength={500}
            placeholder="Jawaban Anda"
          />
        )}

        {question.question_type === 'textarea' && (
          <Textarea
            value={answer.text ?? ''}
            onChange={(e) => setAnswer(question.id, { text: e.target.value })}
            maxLength={5000}
            placeholder="Jawaban Anda"
            className="min-h-[120px]"
          />
        )}

        {question.question_type === 'radio' && (
          <RadioGroup
            value={answer.options?.[0] ?? ''}
            onValueChange={(value) => setAnswer(question.id, { options: [value] })}
          >
            {question.options.map((option) => (
              <div key={option} className="flex items-center gap-2">
                <RadioGroupItem value={option} id={`${question.id}-${option}`} />
                <Label htmlFor={`${question.id}-${option}`} className="font-normal">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}

        {question.question_type === 'checkbox' && (
          <div className="space-y-2">
            {question.options.map((option) => {
              const selected = answer.options ?? [];
              return (
                <div key={option} className="flex items-center gap-2">
                  <Checkbox
                    id={`${question.id}-${option}`}
                    checked={selected.includes(option)}
                    onCheckedChange={(checked) =>
                      setAnswer(question.id, {
                        options: checked
                          ? [...selected, option]
                          : selected.filter((item) => item !== option),
                      })
                    }
                  />
                  <Label htmlFor={`${question.id}-${option}`} className="font-normal">
                    {option}
                  </Label>
                </div>
              );
            })}
          </div>
        )}

        {question.question_type === 'scale' && (
          <div className="flex flex-wrap gap-2">
            {Array.from(
              { length: question.scale_max - question.scale_min + 1 },
              (_, i) => question.scale_min + i
            ).map((value) => (
              <Button
                key={value}
                type="button"
                variant={answer.number === value ? 'default' : 'outline'}
                size="sm"
                className="w-10"
                onClick={() => setAnswer(question.id, { number: value })}
              >
                {value}
              </Button>
            ))}
          </div>
        )}
      </div>
    );
  };

  const sections = useMemo(() => {
    const grouped: Array<{ section: string | null; items: SurveyQuestion[] }> = [];
    questions.forEach((question) => {
      const last = grouped[grouped.length - 1];
      if (last && last.section === (question.section ?? null)) {
        last.items.push(question);
      } else {
        grouped.push({ section: question.section ?? null, items: [question] });
      }
    });
    return grouped;
  }, [questions]);

  let questionIndex = 0;

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={survey ? `${survey.title} | Rapatin` : 'Survei | Rapatin'}
        description={survey?.description ?? 'Isi survei Rapatin'}
      />
      <Navbar />

      <main className="container mx-auto max-w-3xl px-4 pt-24 pb-12 md:px-6 md:pt-32 md:pb-16">
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : notFound || !survey ? (
          <Card>
            <CardContent className="py-16 text-center">
              <h1 className="text-2xl font-bold">Survei tidak ditemukan</h1>
              <p className="mt-2 text-muted-foreground">
                Tautan survei mungkin salah atau sudah dihapus.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardHeader className="space-y-3">
                <CardTitle className="text-2xl leading-snug md:text-3xl">{survey.title}</CardTitle>
                {survey.description && <CardDescription>{survey.description}</CardDescription>}
                {survey.end_date && (
                  <Badge variant="outline" className="w-fit">
                    Ditutup pada {new Date(survey.end_date).toLocaleDateString('id-ID')}
                  </Badge>
                )}
              </CardHeader>
            </Card>

            {isSubmitted ? (
              <Card>
                <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
                  <CheckCircle2 className="h-12 w-12 text-primary" />
                  <h2 className="text-xl font-semibold">Terima kasih atas partisipasi Anda</h2>
                  <p className="text-muted-foreground">
                    Jawaban Anda sudah kami terima. Anda hanya dapat mengisi survei ini satu kali.
                  </p>

                  {survey.has_reward && survey.reward_code && (
                    <div className="mt-6 w-full max-w-md space-y-4 rounded-lg border border-dashed border-primary/40 bg-primary/5 p-5 text-left">
                      <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                        <Gift className="h-4 w-4" />
                        {survey.reward_title || 'Hadiah untuk Anda'}
                      </div>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 rounded-md border bg-background px-3 py-2 text-center font-mono text-lg font-semibold tracking-widest">
                          {survey.reward_code}
                        </code>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={handleCopyCode}
                          aria-label="Salin kode voucher"
                        >
                          {isCopied ? (
                            <Check className="h-4 w-4 text-primary" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      {survey.reward_terms && (
                        <div className="space-y-1">
                          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Ketentuan
                          </p>
                          <div
                            className="prose prose-sm max-w-none text-muted-foreground [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5 [&_a]:text-primary [&_a]:underline"
                            dangerouslySetInnerHTML={{ __html: sanitizedTerms }}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

            ) : isClosed ? (
              <Card>
                <CardContent className="py-16 text-center">
                  <h2 className="text-xl font-semibold">Survei belum/tidak tersedia</h2>
                  <p className="mt-2 text-muted-foreground">
                    Survei ini belum dibuka atau sudah ditutup.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Identitas Responden</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="respondent-name">
                        Nama<span className="ml-1 text-destructive">*</span>
                      </Label>
                      <Input
                        id="respondent-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        maxLength={120}
                        placeholder="Nama lengkap"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="respondent-email">
                        Email<span className="ml-1 text-destructive">*</span>
                      </Label>
                      <Input
                        id="respondent-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        maxLength={255}
                        placeholder="nama@email.com"
                      />
                    </div>
                  </CardContent>
                </Card>

                {sections.map((group, groupIndex) => (
                  <Card key={groupIndex}>
                    {group.section && (
                      <CardHeader>
                        <CardTitle className="text-lg">{group.section}</CardTitle>
                      </CardHeader>
                    )}
                    <CardContent className="space-y-4">
                      {group.items.map((question) => renderQuestion(question, questionIndex++))}
                    </CardContent>
                  </Card>
                ))}

                <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Kirim Jawaban
                </Button>
              </form>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default SurveyDetail;
