import { formatNumber } from "@/lib/utils/formatting";
import { Heart, MessageCircle, Share2, Users, Eye } from "lucide-react";

interface MetricsDisplayProps {
  likes?: number;
  comments?: number;
  shares?: number;
  views?: number;
  collaborators?: number;
  variant?: "horizontal" | "vertical";
  size?: "sm" | "md" | "lg";
  showLabels?: boolean;
}

export function MetricsDisplay({
  likes,
  comments,
  shares,
  views,
  collaborators,
  variant = "horizontal",
  size = "md",
  showLabels = false,
}: MetricsDisplayProps) {
  const iconSize = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  }[size];

  const textSize = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  }[size];

  const containerClass = variant === "horizontal" 
    ? "flex items-center gap-4"
    : "flex flex-col gap-2";

  return (
    <div className={containerClass}>
      {likes !== undefined && (
        <div className="flex items-center gap-1">
          <Heart className={`${iconSize} text-muted-foreground`} />
          <span className={`${textSize} text-muted-foreground`}>
            {formatNumber(likes)}
            {showLabels && " likes"}
          </span>
        </div>
      )}
      
      {comments !== undefined && (
        <div className="flex items-center gap-1">
          <MessageCircle className={`${iconSize} text-muted-foreground`} />
          <span className={`${textSize} text-muted-foreground`}>
            {formatNumber(comments)}
            {showLabels && " comments"}
          </span>
        </div>
      )}
      
      {shares !== undefined && (
        <div className="flex items-center gap-1">
          <Share2 className={`${iconSize} text-muted-foreground`} />
          <span className={`${textSize} text-muted-foreground`}>
            {formatNumber(shares)}
            {showLabels && " shares"}
          </span>
        </div>
      )}
      
      {views !== undefined && (
        <div className="flex items-center gap-1">
          <Eye className={`${iconSize} text-muted-foreground`} />
          <span className={`${textSize} text-muted-foreground`}>
            {formatNumber(views)}
            {showLabels && " views"}
          </span>
        </div>
      )}
      
      {collaborators !== undefined && (
        <div className="flex items-center gap-1">
          <Users className={`${iconSize} text-muted-foreground`} />
          <span className={`${textSize} text-muted-foreground`}>
            {formatNumber(collaborators)}
            {showLabels && " collaborators"}
          </span>
        </div>
      )}
    </div>
  );
}
