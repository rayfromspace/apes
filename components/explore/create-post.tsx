"use client";

import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Send, 
  Image as ImageIcon,
  Link as LinkIcon,
  Code,
  FileText,
  Video,
  Hash,
  X
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { UserAvatar } from "@/components/shared/user-avatar";
import { cn } from "@/lib/utils";

// Popular hashtags for suggestions
const TRENDING_HASHTAGS = [
  "tech", "defi", "ai", "web3", "dev", "research",
  "startup", "blockchain", "crypto", "design", "product"
];

interface HashtagSuggestion {
  tag: string;
  count?: number;
}

export function CreatePost() {
  const [content, setContent] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [showHashtagSuggestions, setShowHashtagSuggestions] = useState(false);
  const [hashtagSuggestions, setHashtagSuggestions] = useState<HashtagSuggestion[]>([]);
  const [cursorPosition, setCursorPosition] = useState<number>(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { user } = useAuth();

  // Extract hashtags from content
  const extractHashtags = (text: string) => {
    const matches = text.match(/#[\w\u0590-\u05ff]+/g) || [];
    return [...new Set(matches.map(tag => tag.slice(1)))];
  };

  // Get current word being typed
  const getCurrentWord = (text: string, position: number) => {
    const beforeCursor = text.slice(0, position);
    const words = beforeCursor.split(/\s/);
    return words[words.length - 1];
  };

  // Handle content change and hashtag detection
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    const cursorPos = e.target.selectionStart || 0;
    setContent(newContent);
    setCursorPosition(cursorPos);

    // Extract hashtags
    const newHashtags = extractHashtags(newContent);
    setHashtags(newHashtags);

    // Check for hashtag suggestions
    const currentWord = getCurrentWord(newContent, cursorPos);
    if (currentWord.startsWith("#")) {
      const searchTerm = currentWord.slice(1).toLowerCase();
      const suggestions = TRENDING_HASHTAGS
        .filter(tag => tag.toLowerCase().includes(searchTerm))
        .map(tag => ({ tag, count: Math.floor(Math.random() * 1000) })); // Mock usage count
      setHashtagSuggestions(suggestions);
      setShowHashtagSuggestions(true);
    } else {
      setShowHashtagSuggestions(false);
    }
  };

  // Insert hashtag at cursor position
  const insertHashtag = (tag: string) => {
    if (!textareaRef.current) return;

    const beforeCursor = content.slice(0, cursorPosition);
    const afterCursor = content.slice(cursorPosition);
    const lastWord = getCurrentWord(content, cursorPosition);
    const newContent = beforeCursor.slice(0, -lastWord.length) + "#" + tag + " " + afterCursor;

    setContent(newContent);
    setShowHashtagSuggestions(false);

    // Focus and set cursor position after the inserted hashtag
    textareaRef.current.focus();
    const newPosition = beforeCursor.length - lastWord.length + tag.length + 2;
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.setSelectionRange(newPosition, newPosition);
      }
    }, 0);
  };

  const handleSubmit = () => {
    if (!content.trim()) return;
    console.log({
      content,
      hashtags
    });
    setContent("");
    setHashtags([]);
    setIsExpanded(false);
  };

  return (
    <Card className={cn(
      "p-4 mb-6 transition-all duration-300",
      isExpanded && "bg-card/50 backdrop-blur"
    )}>
      {!isExpanded ? (
        <div className="relative">
          <Input
            placeholder="What do you want to share today?"
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setIsExpanded(true);
            }}
            onFocus={() => setIsExpanded(true)}
            className={cn(
              "pr-12 h-14 text-lg transition-all duration-300",
              "hover:shadow-[0_0_15px_rgba(0,200,0,0.3)] focus:shadow-[0_0_20px_rgba(0,200,0,0.4)]",
              "border-2 hover:border-primary/30 focus:border-primary/40"
            )}
          />
          <Button 
            size="icon" 
            onClick={handleSubmit}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 bg-primary/80 hover:bg-primary"
            disabled={!content.trim()}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex gap-4">
            <UserAvatar 
              user={{
                id: user?.id || '',
                name: user?.name || 'User',
                avatar: user?.avatar,
              }}
              showHoverCard={false}
              size="md"
            />
            <div className="flex-1">
              <div className="relative">
                <Textarea
                  ref={textareaRef}
                  placeholder="Share project updates or start a discussion... Use # to add topics"
                  value={content}
                  onChange={handleContentChange}
                  className="min-h-[120px] mb-4 text-lg pr-10"
                  autoFocus
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2 h-8 w-8 text-muted-foreground hover:text-primary"
                  onClick={() => insertHashtag("")}
                >
                  <Hash className="h-4 w-4" />
                </Button>

                {/* Hashtag Suggestions */}
                {showHashtagSuggestions && hashtagSuggestions.length > 0 && (
                  <div className="absolute bottom-full mb-2 w-full max-h-[200px] overflow-y-auto rounded-lg border bg-background shadow-lg">
                    {hashtagSuggestions.map(({ tag, count }) => (
                      <button
                        key={tag}
                        className="flex items-center justify-between w-full px-4 py-2 text-sm hover:bg-muted"
                        onClick={() => insertHashtag(tag)}
                      >
                        <span className="flex items-center gap-2">
                          <Hash className="h-3 w-3 text-muted-foreground" />
                          {tag}
                        </span>
                        {count && (
                          <span className="text-xs text-muted-foreground">
                            {count} posts
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Display current hashtags */}
              {hashtags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {hashtags.map(tag => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="pl-2 h-7 gap-1 group hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                      <Hash className="h-3 w-3 text-muted-foreground group-hover:text-primary" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Trending hashtags */}
              {hashtags.length === 0 && (
                <div className="mb-4">
                  <div className="text-sm text-muted-foreground mb-2">
                    Trending topics
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {TRENDING_HASHTAGS.slice(0, 6).map(tag => (
                      <button
                        key={tag}
                        onClick={() => insertHashtag(tag)}
                        className={cn(
                          "inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm",
                          "bg-muted hover:bg-primary/10 hover:text-primary transition-colors"
                        )}
                      >
                        <Hash className="h-3 w-3" />
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-9 w-9"
                    onClick={() => {/* Handle image upload */}}
                  >
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-9 w-9"
                    onClick={() => {/* Handle video upload */}}
                  >
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-9 w-9"
                    onClick={() => {/* Handle file upload */}}
                  >
                    <FileText className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-9 w-9"
                    onClick={() => {/* Handle code snippet */}}
                  >
                    <Code className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-9 w-9"
                    onClick={() => {/* Handle link */}}
                  >
                    <LinkIcon className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    onClick={() => {
                      setIsExpanded(false);
                      setContent("");
                      setHashtags([]);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSubmit}
                    disabled={!content.trim()}
                    className="bg-primary/80 hover:bg-primary"
                  >
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}