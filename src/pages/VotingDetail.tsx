import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Voting, VotingOption, VotingResults } from '@/types/VotingTypes';
import { generateUserIdentifier, isVotingActive, getTimeRemaining, formatVotingResults } from '@/utils/votingUtils';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Clock, CheckCircle2, Share2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const VotingDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [userIdentifier] = useState<string>(() => generateUserIdentifier());
  const [userName, setUserName] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');

  // Fetch voting data
  const { data: voting, isLoading, error } = useQuery({
    queryKey: ['voting', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('votings')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (error) throw error;
      return data as Voting;
    },
  });

  // Fetch voting options
  const { data: options } = useQuery({
    queryKey: ['voting-options', voting?.id],
    queryFn: async () => {
      if (!voting?.id) return [];
      
      const { data, error } = await supabase
        .from('voting_options')
        .select('*')
        .eq('voting_id', voting.id)
        .order('option_order', { ascending: true });
      
      if (error) throw error;
      return data as VotingOption[];
    },
    enabled: !!voting?.id,
  });

  // Check if user already voted
  const { data: hasVoted } = useQuery({
    queryKey: ['user-voted', voting?.id, userIdentifier],
    queryFn: async () => {
      if (!voting?.id) return false;
      
      const { data, error } = await supabase
        .from('voting_responses')
        .select('id')
        .eq('voting_id', voting.id)
        .eq('user_identifier', userIdentifier)
        .limit(1);
      
      if (error) throw error;
      return (data && data.length > 0);
    },
    enabled: !!voting?.id,
  });

  // Submit vote mutation
  const submitVoteMutation = useMutation({
    mutationFn: async () => {
      if (!voting?.id || selectedOptions.length === 0) {
        throw new Error('Pilih minimal satu opsi');
      }

      // Validate user data if anonymous voting is not allowed
      if (!voting.allow_anonymous) {
        if (!userName.trim()) {
          throw new Error('Nama wajib diisi');
        }
        if (!userEmail.trim()) {
          throw new Error('Email wajib diisi');
        }
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userEmail)) {
          throw new Error('Format email tidak valid');
        }
      }

      const { data, error } = await supabase.functions.invoke('submit-vote', {
        body: {
          voting_id: voting.id,
          option_ids: selectedOptions,
          user_identifier: userIdentifier,
          user_name: voting.allow_anonymous ? null : userName,
          user_email: voting.allow_anonymous ? null : userEmail,
        },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Vote berhasil dikirim!');
      queryClient.invalidateQueries({ queryKey: ['voting', slug] });
      queryClient.invalidateQueries({ queryKey: ['voting-options', voting?.id] });
      queryClient.invalidateQueries({ queryKey: ['user-voted', voting?.id] });
      setSelectedOptions([]);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Gagal mengirim vote');
    },
  });

  const handleOptionToggle = (optionId: string) => {
    if (!voting) return;

    if (voting.voting_type === 'single') {
      setSelectedOptions([optionId]);
    } else {
      setSelectedOptions((prev) => {
        const isSelected = prev.includes(optionId);
        if (isSelected) {
          return prev.filter((id) => id !== optionId);
        } else {
          // Check max selections
          if (voting.max_selections && prev.length >= voting.max_selections) {
            toast.error(`Maksimal ${voting.max_selections} pilihan`);
            return prev;
          }
          return [...prev, optionId];
        }
      });
    }
  };

  const handleSubmit = () => {
    if (selectedOptions.length === 0) {
      toast.error('Pilih minimal satu opsi');
      return;
    }
    
    // Validate user data if anonymous voting is not allowed
    if (!voting?.allow_anonymous) {
      if (!userName.trim()) {
        toast.error('Nama wajib diisi');
        return;
      }
      if (!userEmail.trim()) {
        toast.error('Email wajib diisi');
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userEmail)) {
        toast.error('Format email tidak valid');
        return;
      }
    }
    
    submitVoteMutation.mutate();
  };

  const handleShare = (platform: 'whatsapp' | 'twitter' | 'facebook') => {
    const url = window.location.href;
    const text = `Vote: ${voting?.title}`;
    
    const shareUrls = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    };

    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  };

  // Redirect if voting not found
  useEffect(() => {
    if (error) {
      navigate('/404');
    }
  }, [error, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Memuat voting...</p>
        </div>
      </div>
    );
  }

  if (!voting || !options) {
    return null;
  }

  const isActive = isVotingActive(voting);
  const showResults = voting.show_results || voting.status === 'closed' || hasVoted;
  const totalVotes = voting.total_votes || 0;

  return (
    <>
      <SEO
        title={voting.title}
        description={voting.description || `Berikan suara Anda untuk ${voting.title}`}
        image={voting.cover_image || undefined}
      />
      
      <Navbar />
      
      <main className="min-h-screen bg-gradient-to-b from-background to-secondary/20 pt-34 pb-12">
        <div className="container max-w-4xl mx-auto px-4">
          {/* Hero Section */}
          {voting.cover_image && (
            <div className="mb-8 rounded-xl overflow-hidden">
              <img
                src={voting.cover_image}
                alt={voting.title}
                className="w-full h-64 object-cover"
              />
            </div>
          )}

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              {voting.category && (
                <Badge variant="secondary">{voting.category}</Badge>
              )}
              <Badge variant={isActive ? 'default' : 'outline'}>
                {voting.status === 'active' ? 'Aktif' : 'Selesai'}
              </Badge>
            </div>
            
            <h1 className="text-4xl font-bold mb-4">{voting.title}</h1>
            
            {voting.description && (
              <p className="text-lg text-muted-foreground mb-6">
                {voting.description}
              </p>
            )}

            {/* Timer */}
            {voting.end_date && isActive && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Berakhir {getTimeRemaining(voting.end_date)}</span>
              </div>
            )}

            {/* Total Votes */}
            <div className="mt-4 text-sm text-muted-foreground">
              Total suara: <span className="font-semibold">{totalVotes}</span>
            </div>
          </div>

          {/* Voting Form */}
          {isActive && !hasVoted ? (
            <Card className="p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">
                {voting.voting_type === 'single' 
                  ? 'Pilih satu opsi:' 
                  : `Pilih hingga ${voting.max_selections || 'beberapa'} opsi:`}
              </h2>

              {voting.voting_type === 'single' ? (
                <RadioGroup
                  value={selectedOptions[0] || ''}
                  onValueChange={(value) => handleOptionToggle(value)}
                >
                  <div className="space-y-3">
                    {options.map((option) => (
                      <div key={option.id} className="flex items-start space-x-3 p-4 rounded-lg border hover:border-primary transition-colors cursor-pointer">
                        <RadioGroupItem value={option.id} id={option.id} />
                        <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                          {option.option_image && (
                            <img
                              src={option.option_image}
                              alt={option.option_text}
                              className="w-full h-32 object-cover rounded-md mb-2"
                            />
                          )}
                          <span className="text-base">{option.option_text}</span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              ) : (
                <div className="space-y-3">
                  {options.map((option) => (
                    <div key={option.id} className="flex items-start space-x-3 p-4 rounded-lg border hover:border-primary transition-colors cursor-pointer">
                      <Checkbox
                        id={option.id}
                        checked={selectedOptions.includes(option.id)}
                        onCheckedChange={() => handleOptionToggle(option.id)}
                      />
                      <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                        {option.option_image && (
                          <img
                            src={option.option_image}
                            alt={option.option_text}
                            className="w-full h-32 object-cover rounded-md mb-2"
                          />
                        )}
                        <span className="text-base">{option.option_text}</span>
                      </Label>
                    </div>
                  ))}
                </div>
              )}

              {/* User Data Form - Only show if anonymous voting is not allowed */}
              {!voting.allow_anonymous && (
                <div className="mt-6 p-4 bg-muted/50 rounded-lg space-y-4">
                  <h3 className="font-semibold text-sm text-muted-foreground">Data Responden</h3>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="user-name">Nama Lengkap *</Label>
                      <Input
                        id="user-name"
                        type="text"
                        placeholder="Masukkan nama lengkap Anda"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="user-email">Email *</Label>
                      <Input
                        id="user-email"
                        type="email"
                        placeholder="nama@email.com"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              <Button
                onClick={handleSubmit}
                disabled={selectedOptions.length === 0 || submitVoteMutation.isPending}
                className="w-full mt-6"
                size="lg"
              >
                {submitVoteMutation.isPending ? 'Mengirim...' : 'Kirim Vote'}
              </Button>
            </Card>
          ) : hasVoted ? (
            <Card className="p-6 mb-8 bg-primary/5 border-primary/20">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6 text-primary" />
                <div>
                  <h3 className="font-semibold">Terima kasih sudah vote!</h3>
                  <p className="text-sm text-muted-foreground">Anda sudah memberikan suara untuk voting ini</p>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-6 mb-8 bg-muted">
              <p className="text-center text-muted-foreground">
                Voting ini sudah ditutup
              </p>
            </Card>
          )}

          {/* Results */}
          {showResults && (
            <Card className="p-6 mb-8">
              <h2 className="text-xl font-semibold mb-6">Hasil Voting</h2>
              <div className="space-y-4">
                {options
                  .map((option) => {
                    const percentage = totalVotes > 0 
                      ? Math.round((option.vote_count / totalVotes) * 100) 
                      : 0;
                    return { ...option, percentage };
                  })
                  .sort((a, b) => b.vote_count - a.vote_count)
                  .map((option, index) => (
                    <div key={option.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {index === 0 && option.vote_count > 0 && (
                            <span className="text-lg">🏆</span>
                          )}
                          <span className="font-medium">{option.option_text}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span className="font-semibold">{option.percentage}%</span>
                          <span>({option.vote_count} suara)</span>
                        </div>
                      </div>
                      <Progress value={option.percentage} className="h-3" />
                    </div>
                  ))}
              </div>
            </Card>
          )}

          {/* Share Buttons */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Share2 className="h-5 w-5" />
                <span className="font-medium">Bagikan voting ini:</span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShare('whatsapp')}
                >
                  WhatsApp
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShare('twitter')}
                >
                  Twitter
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShare('facebook')}
                >
                  Facebook
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default VotingDetail;
