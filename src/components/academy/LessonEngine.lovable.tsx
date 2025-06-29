import * as React from "react";

export type LessonSection = {
  id: string;
  title: string;
  content: string; // Markdown or HTML
  videoUrl?: string;
  pdfUrl?: string;
  quizId?: string;
};

type Props = {
  sections: LessonSection[];
  onProgressUpdate?: (completedIds: string[]) => void;
  onTakeQuiz?: (quizId: string, sectionId: string) => void;
};

const getEmbedUrl = (url: string): string | null => {
  let videoId: string | null = null;
  if (url.includes('youtube.com/watch?v=')) {
    videoId = url.split('v=')[1].split('&')[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }
  if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1].split('?')[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }
  if (url.includes('vimeo.com/')) {
    videoId = url.split('vimeo.com/')[1].split('?')[0];
    return `https://player.vimeo.com/video/${videoId}`;
  }
  return null;
};

const LessonEngine = ({ sections, onProgressUpdate, onTakeQuiz }: Props) => {
  const [completedIds, setCompletedIds] = React.useState<Set<string>>(new Set());
  const [visibleSections, setVisibleSections] = React.useState<Set<string>>(new Set());
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (onProgressUpdate) {
      onProgressUpdate(Array.from(completedIds));
    }
  }, [completedIds, onProgressUpdate]);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.getAttribute('data-section-id');
          if (id && entry.isIntersecting) {
            setVisibleSections((prev) => new Set(prev).add(id));
            setCompletedIds((prev) => {
              if (prev.has(id)) {
                return prev;
              }
              const newSet = new Set(prev);
              newSet.add(id);
              return newSet;
            });
          }
        });
      },
      { threshold: 0.5 }
    );

    const currentRef = containerRef.current;
    if (currentRef) {
      const children = Array.from(currentRef.children);
      children.forEach((child) => observer.observe(child as Element));
      return () => {
        children.forEach((child) => observer.unobserve(child as Element));
      };
    }
  }, [sections, onProgressUpdate]);
  
  return (
    <div ref={containerRef} style={{ marginTop: "32px" }}>
      {sections.map((section) => {
        const isVisible = visibleSections.has(section.id);
        const embedUrl = section.videoUrl ? getEmbedUrl(section.videoUrl) : null;

        return (
          <div
            key={section.id}
            data-section-id={section.id}
            className={`rounded-xl bg-black/30 p-6 border border-white/10 backdrop-blur-md shadow-lg space-y-4 transition-all duration-500 ease-out transform ${isVisible ? 'opacity-100 translate-y-0 delay-100' : 'opacity-0 translate-y-5'}`}
          >
            <h2 style={{ color: "white", fontWeight: "700" }}>{section.title}</h2>
            
            <div
              
              dangerouslySetInnerHTML={{ __html: section.content }}
            />

            {embedUrl && (
              <div style={{position: 'relative', paddingBottom: '56.25%', height: 0}}>
                <iframe
                  src={embedUrl}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={section.title}
                  style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}}
                  
                />
              </div>
            )}

            <div style={{ display: "flex" }}>
              {section.pdfUrl && (
                <a
                  href={section.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  style={{ color: "white", paddingLeft: "16px", paddingRight: "16px", display: "flex", alignItems: "center" }}
                >
                  <span>📄</span> Download PDF
                </a>
              )}

              {section.quizId && (
                <button
                  onClick={() => onTakeQuiz?.(section.quizId!, section.id)}
                  style={{ color: "white", fontWeight: "700", display: "flex", alignItems: "center" }}
                >
                  <span>🧠</span> Take Quiz
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LessonEngine; 