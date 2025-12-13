/**
 * Social Media Sharing Component
 * Optimized sharing buttons with tracking and SEO benefits
 */

'use client';

import { useState } from 'react';
import { Share2, Twitter, Facebook, Linkedin, Link, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface SocialShareProps {
  url?: string;
  title?: string;
  description?: string;
  hashtags?: string[];
  via?: string;
  className?: string;
}

export function SocialShare({
  url = typeof window !== 'undefined' ? window.location.href : '',
  title = 'CODEEX AI - Advanced Multi-Provider AI Assistant',
  description = 'Experience the future of AI with CODEEX AI - free AI chat, code generation, problem solving, and more!',
  hashtags = ['AI', 'ArtificialIntelligence', 'CodeGeneration', 'AIAssistant', 'MachineLearning', 'Productivity'],
  via = 'codeexai',
  className = ''
}: SocialShareProps) {
  const [isOpen, setIsOpen] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);
  const encodedHashtags = encodeURIComponent(hashtags.join(','));

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}&hashtags=${encodedHashtags}&via=${via}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodedTitle}&summary=${encodedDescription}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
    hackernews: `https://news.ycombinator.com/submitlink?u=${encodedUrl}&t=${encodedTitle}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`
  };

  const handleShare = async (platform: string, shareUrl: string) => {
    // Track sharing event (you can integrate with analytics)
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'share', {
        method: platform,
        content_type: 'webpage',
        item_id: url
      });
    }

    // Open share window
    if (platform === 'email') {
      window.location.href = shareUrl;
    } else {
      window.open(
        shareUrl,
        'share-dialog',
        'width=600,height=400,scrollbars=yes,resizable=yes'
      );
    }
    
    setIsOpen(false);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: 'Link copied!',
        description: 'The link has been copied to your clipboard.',
      });
      
      // Track copy event
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'share', {
          method: 'copy_link',
          content_type: 'webpage',
          item_id: url
        });
      }
    } catch (err) {
      toast({
        title: 'Failed to copy',
        description: 'Please copy the link manually.',
        variant: 'destructive',
      });
    }
    setIsOpen(false);
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share({
          title,
          text: description,
          url
        });
        
        // Track native share
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'share', {
            method: 'native',
            content_type: 'webpage',
            item_id: url
          });
        }
      } catch (err) {
        // User cancelled or error occurred
        console.log('Share cancelled');
      }
    }
  };

  return (
    <div className={className}>
      {/* Native Share API (mobile) */}
      {typeof window !== 'undefined' && typeof navigator !== 'undefined' && 'share' in navigator && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleNativeShare}
          className="md:hidden"
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      )}

      {/* Desktop Share Menu */}
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={typeof window !== 'undefined' && typeof navigator !== 'undefined' && 'share' in navigator ? 'hidden md:flex' : ''}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => handleShare('twitter', shareLinks.twitter)}>
            <Twitter className="h-4 w-4 mr-2" />
            Twitter
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleShare('facebook', shareLinks.facebook)}>
            <Facebook className="h-4 w-4 mr-2" />
            Facebook
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleShare('linkedin', shareLinks.linkedin)}>
            <Linkedin className="h-4 w-4 mr-2" />
            LinkedIn
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleShare('whatsapp', shareLinks.whatsapp)}>
            <MessageCircle className="h-4 w-4 mr-2" />
            WhatsApp
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleCopyLink}>
            <Link className="h-4 w-4 mr-2" />
            Copy Link
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

// Floating share buttons for articles/blog posts
export function FloatingSocialShare(props: SocialShareProps) {
  return (
    <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-50 hidden lg:flex flex-col gap-2">
      <div className="bg-background/80 backdrop-blur-sm border rounded-lg p-2 shadow-lg">
        <SocialShare {...props} />
      </div>
    </div>
  );
}

// Inline share buttons for content
export function InlineSocialShare({
  className = "flex items-center gap-2 py-4 border-t border-b",
  ...props
}: SocialShareProps) {
  return (
    <div className={className}>
      <span className="text-sm text-muted-foreground mr-2">Share:</span>
      <SocialShare {...props} />
    </div>
  );
}