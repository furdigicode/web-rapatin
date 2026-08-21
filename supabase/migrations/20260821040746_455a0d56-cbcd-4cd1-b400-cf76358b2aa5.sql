CREATE TABLE public.surveys (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  slug text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'draft',
  start_date timestamp with time zone,
  end_date timestamp with time zone,
  total_responses integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE public.survey_questions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  survey_id uuid NOT NULL REFERENCES public.surveys(id) ON DELETE CASCADE,
  section text,
  question_text text NOT NULL,
  question_type text NOT NULL DEFAULT 'text',
  is_required boolean NOT NULL DEFAULT false,
  options jsonb NOT NULL DEFAULT '[]'::jsonb,
  scale_min integer NOT NULL DEFAULT 1,
  scale_max integer NOT NULL DEFAULT 5,
  question_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE public.survey_responses (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  survey_id uuid NOT NULL REFERENCES public.surveys(id) ON DELETE CASCADE,
  respondent_name text NOT NULL,
  respondent_email text NOT NULL,
  user_identifier text NOT NULL,
  submitted_at timestamp with time zone NOT NULL DEFAULT now(),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE public.survey_answers (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  response_id uuid NOT NULL REFERENCES public.survey_responses(id) ON DELETE CASCADE,
  question_id uuid NOT NULL REFERENCES public.survey_questions(id) ON DELETE CASCADE,
  answer_text text,
  answer_options jsonb NOT NULL DEFAULT '[]'::jsonb,
  answer_number integer,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX idx_survey_questions_survey ON public.survey_questions(survey_id, question_order);
CREATE INDEX idx_survey_responses_survey ON public.survey_responses(survey_id);
CREATE UNIQUE INDEX idx_survey_responses_unique_ident ON public.survey_responses(survey_id, user_identifier);
CREATE UNIQUE INDEX idx_survey_responses_unique_email ON public.survey_responses(survey_id, lower(respondent_email));
CREATE INDEX idx_survey_answers_response ON public.survey_answers(response_id);

GRANT SELECT ON public.surveys TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.surveys TO authenticated;
GRANT ALL ON public.surveys TO service_role;

GRANT SELECT ON public.survey_questions TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.survey_questions TO authenticated;
GRANT ALL ON public.survey_questions TO service_role;

GRANT SELECT ON public.survey_responses TO authenticated;
GRANT ALL ON public.survey_responses TO service_role;

GRANT SELECT ON public.survey_answers TO authenticated;
GRANT ALL ON public.survey_answers TO service_role;

ALTER TABLE public.surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active surveys"
ON public.surveys FOR SELECT
USING (status = 'active');

CREATE POLICY "Admins can view all surveys"
ON public.surveys FOR SELECT
TO authenticated
USING (public.is_custom_admin_user());

CREATE POLICY "Admins can insert surveys"
ON public.surveys FOR INSERT
TO authenticated
WITH CHECK (public.is_custom_admin_user());

CREATE POLICY "Admins can update surveys"
ON public.surveys FOR UPDATE
TO authenticated
USING (public.is_custom_admin_user());

CREATE POLICY "Admins can delete surveys"
ON public.surveys FOR DELETE
TO authenticated
USING (public.is_custom_admin_user());

CREATE POLICY "Public can view questions of active surveys"
ON public.survey_questions FOR SELECT
USING (EXISTS (SELECT 1 FROM public.surveys s WHERE s.id = survey_id AND s.status = 'active'));

CREATE POLICY "Admins can view all questions"
ON public.survey_questions FOR SELECT
TO authenticated
USING (public.is_custom_admin_user());

CREATE POLICY "Admins can insert questions"
ON public.survey_questions FOR INSERT
TO authenticated
WITH CHECK (public.is_custom_admin_user());

CREATE POLICY "Admins can update questions"
ON public.survey_questions FOR UPDATE
TO authenticated
USING (public.is_custom_admin_user());

CREATE POLICY "Admins can delete questions"
ON public.survey_questions FOR DELETE
TO authenticated
USING (public.is_custom_admin_user());

CREATE POLICY "Admins can view responses"
ON public.survey_responses FOR SELECT
TO authenticated
USING (public.is_custom_admin_user());

CREATE POLICY "Admins can view answers"
ON public.survey_answers FOR SELECT
TO authenticated
USING (public.is_custom_admin_user());

CREATE TRIGGER update_surveys_updated_at
BEFORE UPDATE ON public.surveys
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_survey_questions_updated_at
BEFORE UPDATE ON public.survey_questions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_survey_responses_updated_at
BEFORE UPDATE ON public.survey_responses
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.increment_survey_response_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.surveys
  SET total_responses = total_responses + 1,
      updated_at = now()
  WHERE id = NEW.survey_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_increment_survey_response_count
AFTER INSERT ON public.survey_responses
FOR EACH ROW EXECUTE FUNCTION public.increment_survey_response_count();