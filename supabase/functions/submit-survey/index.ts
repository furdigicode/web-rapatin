import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AnswerInput {
  question_id: string;
  answer_text?: string | null;
  answer_options?: string[];
  answer_number?: number | null;
}

interface SubmitInput {
  survey_id: string;
  respondent_name: string;
  respondent_email: string;
  user_identifier: string;
  answers: AnswerInput[];
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const body = (await req.json()) as SubmitInput;
    const { survey_id, respondent_name, respondent_email, user_identifier, answers } = body ?? {};

    if (!survey_id || !user_identifier || !Array.isArray(answers)) {
      return json({ error: 'Data tidak lengkap' }, 400);
    }

    const name = (respondent_name ?? '').trim();
    const email = (respondent_email ?? '').trim().toLowerCase();

    if (!name || name.length > 120) {
      return json({ error: 'Nama wajib diisi (maks 120 karakter)' }, 400);
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 255) {
      return json({ error: 'Format email tidak valid' }, 400);
    }

    const { data: survey, error: surveyError } = await supabase
      .from('surveys')
      .select('*')
      .eq('id', survey_id)
      .maybeSingle();

    if (surveyError || !survey) {
      return json({ error: 'Survei tidak ditemukan' }, 404);
    }
    if (survey.status !== 'active') {
      return json({ error: 'Survei tidak aktif' }, 400);
    }

    const now = new Date();
    if (survey.start_date && new Date(survey.start_date) > now) {
      return json({ error: 'Survei belum dibuka' }, 400);
    }
    if (survey.end_date && new Date(survey.end_date) < now) {
      return json({ error: 'Survei sudah ditutup' }, 400);
    }

    // Duplicate check (fingerprint or email)
    const { data: duplicates } = await supabase
      .from('survey_responses')
      .select('id, user_identifier, respondent_email')
      .eq('survey_id', survey_id);

    const alreadySubmitted = (duplicates ?? []).some(
      (row) =>
        row.user_identifier === user_identifier ||
        (row.respondent_email ?? '').toLowerCase() === email
    );
    if (alreadySubmitted) {
      return json({ error: 'Anda sudah pernah mengisi survei ini' }, 400);
    }

    const { data: questions, error: questionsError } = await supabase
      .from('survey_questions')
      .select('*')
      .eq('survey_id', survey_id)
      .order('question_order', { ascending: true });

    if (questionsError || !questions || questions.length === 0) {
      return json({ error: 'Survei belum memiliki pertanyaan' }, 400);
    }

    const answerMap = new Map<string, AnswerInput>();
    for (const answer of answers) {
      if (answer?.question_id) answerMap.set(answer.question_id, answer);
    }

    const rowsToInsert: Omit<AnswerInput, 'question_id'> &
      { question_id: string; response_id?: string }[] = [] as any;
    const prepared: Array<{
      question_id: string;
      answer_text: string | null;
      answer_options: string[];
      answer_number: number | null;
    }> = [];

    for (const question of questions) {
      const provided = answerMap.get(question.id);
      const options: string[] = Array.isArray(question.options) ? question.options : [];

      let answer_text: string | null = null;
      let answer_options: string[] = [];
      let answer_number: number | null = null;

      if (question.question_type === 'text' || question.question_type === 'textarea') {
        answer_text = typeof provided?.answer_text === 'string' ? provided.answer_text.trim() : '';
        if (answer_text.length > 5000) {
          return json({ error: `Jawaban terlalu panjang: ${question.question_text}` }, 400);
        }
        if (!answer_text) answer_text = null;
      } else if (question.question_type === 'radio' || question.question_type === 'checkbox') {
        const selected = Array.isArray(provided?.answer_options) ? provided!.answer_options! : [];
        answer_options = selected.filter((value) => options.includes(value));
        if (question.question_type === 'radio' && answer_options.length > 1) {
          answer_options = answer_options.slice(0, 1);
        }
      } else if (question.question_type === 'scale') {
        const value = provided?.answer_number;
        if (typeof value === 'number' && Number.isFinite(value)) {
          if (value < question.scale_min || value > question.scale_max) {
            return json({ error: `Nilai skala tidak valid: ${question.question_text}` }, 400);
          }
          answer_number = Math.round(value);
        }
      }

      const isEmpty =
        answer_text === null && answer_options.length === 0 && answer_number === null;

      if (question.is_required && isEmpty) {
        return json({ error: `Pertanyaan wajib belum dijawab: ${question.question_text}` }, 400);
      }

      if (!isEmpty) {
        prepared.push({
          question_id: question.id,
          answer_text,
          answer_options,
          answer_number,
        });
      }
    }

    const { data: response, error: responseError } = await supabase
      .from('survey_responses')
      .insert({
        survey_id,
        respondent_name: name,
        respondent_email: email,
        user_identifier,
        metadata: {
          user_agent: req.headers.get('user-agent'),
          timestamp: new Date().toISOString(),
        },
      })
      .select('id')
      .single();

    if (responseError || !response) {
      console.error('Failed to insert response:', responseError);
      const isDuplicate = responseError?.code === '23505' || responseError?.code === '23514';
      return json(
        { error: isDuplicate ? 'Anda sudah pernah mengisi survei ini' : 'Gagal menyimpan respons' },
        isDuplicate ? 400 : 500
      );
    }

    if (prepared.length > 0) {
      const { error: answersError } = await supabase.from('survey_answers').insert(
        prepared.map((item) => ({ ...item, response_id: response.id }))
      );
      if (answersError) {
        console.error('Failed to insert answers:', answersError);
        await supabase.from('survey_responses').delete().eq('id', response.id);
        return json({ error: 'Gagal menyimpan jawaban' }, 500);
      }
    }

    console.log(`Survey ${survey_id} submitted by ${email}`);
    return json({ success: true, response_id: response.id });
  } catch (error) {
    console.error('submit-survey error:', error);
    return json({ error: 'Terjadi kesalahan pada server' }, 500);
  }
});
