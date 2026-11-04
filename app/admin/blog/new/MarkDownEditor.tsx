
"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownEditorProps {
  initialContent?: string;
}

export default function MarkdownEditor({
  initialContent = "",
}: MarkdownEditorProps) {
  const [content, setContent] = useState(initialContent);

  return (
    <div className="space-y-4">
      <div>
        <label
          htmlFor="content"
          className="mb-2 block text-sm font-semibold"
        >
          Full Blog Content *
        </label>

        <div className="mb-3 flex flex-wrap gap-2 text-xs text-[#77675B]">
          <span className="rounded bg-[#F7F5F0] px-2 py-1">
            ## Heading 2
          </span>
          <span className="rounded bg-[#F7F5F0] px-2 py-1">
            ### Heading 3
          </span>
          <span className="rounded bg-[#F7F5F0] px-2 py-1">
            **Bold**
          </span>
          <span className="rounded bg-[#F7F5F0] px-2 py-1">
            *Italic*
          </span>
          <span className="rounded bg-[#F7F5F0] px-2 py-1">
            - List item
          </span>
        </div>

        <textarea
          id="content"
          name="content"
          rows={18}
          required
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Write your blog article here..."
          className="w-full rounded-lg border border-[#DCCFC1] px-4 py-3 leading-7 outline-none focus:border-[#684633]"
        />

        <p className="mt-2 text-xs text-[#8B8178]">
          Supports Markdown headings, bold, italic, lists, links and tables.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-[#E6DDD2]">
        <div className="border-b border-[#E6DDD2] bg-[#F7F5F0] px-4 py-3">
          <h3 className="font-semibold text-[#684633]">
            Live Article Preview
          </h3>
          <p className="mt-1 text-xs text-[#8B8178]">
            Preview your formatted blog before publishing.
          </p>
        </div>

        <div className="prose prose-stone max-w-none p-5 text-[#29231F] prose-headings:font-serif prose-headings:text-[#684633] prose-a:text-[#8B624B] prose-strong:text-[#29231F]">
          {content.trim() ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content}
            </ReactMarkdown>
          ) : (
            <p className="text-sm text-[#9A9188]">
              Your article preview will appear here.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
