import Link from "@tiptap/extension-link";
import StarterKit from "@tiptap/starter-kit";
import { EditorContent, useEditor } from "@tiptap/react";
import { useEffect, useRef } from "react";

import Icon from "../../components/Icon";

/**
 * Deliberately constrained to a small tag set: paragraph, bold, italic,
 * h2/h3, bullet/ordered list, blockquote, link. Nothing here produces raw
 * HTML, images, or embeds -- keeping the editor's output small is what
 * makes the backend sanitizer's allow-list (core/sanitize.py) tight and
 * easy to audit. Widening one without the other either breaks legitimate
 * formatting or lets unintended tags through.
 */
const EXTENSIONS = [
  StarterKit.configure({
    heading: { levels: [2, 3] },
    strike: false,
    code: false,
    codeBlock: false,
    horizontalRule: false,
  }),
  Link.configure({ openOnClick: false, autolink: true }),
];

function ToolbarButton({ onClick, active, disabled, label, icon }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-pressed={active}
      className={`p-space-xs rounded transition-colors disabled:opacity-40 ${
        active ? "bg-primary-container text-on-primary" : "text-on-surface-variant hover:bg-surface-container-high"
      }`}
    >
      <Icon name={icon} className="text-[18px]" />
    </button>
  );
}

/** @param {{value: string, onChange: (html: string) => void}} props */
export default function RichTextEditor({ value, onChange }) {
  const initialised = useRef(false);

  const editor = useEditor({
    extensions: EXTENSIONS,
    content: value || "",
    onUpdate: ({ editor: instance }) => onChange(instance.getHTML()),
    editorProps: {
      attributes: {
        class: "min-h-[220px] px-space-md py-space-sm focus:outline-none [&_a]:text-primary [&_a]:underline",
      },
    },
  });

  // The article often loads asynchronously (edit mode fetches it after
  // mount); sync it into the editor once it arrives, but never again after
  // that so we don't clobber the admin's in-progress edits or cursor.
  useEffect(() => {
    if (!editor || initialised.current) return;
    if (value) {
      editor.commands.setContent(value);
    }
    initialised.current = true;
  }, [editor, value]);

  if (!editor) return null;

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Link URL", previousUrl || "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className="rounded-lg border border-outline-variant bg-surface overflow-hidden">
      <div className="flex flex-wrap items-center gap-space-xxs px-space-xs py-space-xxs border-b border-outline-variant bg-surface-container-low">
        <ToolbarButton
          label="Bold"
          icon="format_bold"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        />
        <ToolbarButton
          label="Italic"
          icon="format_italic"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        />
        <ToolbarButton
          label="Heading 2"
          icon="format_h2"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        />
        <ToolbarButton
          label="Heading 3"
          icon="format_h3"
          active={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        />
        <ToolbarButton
          label="Bullet list"
          icon="format_list_bulleted"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        />
        <ToolbarButton
          label="Numbered list"
          icon="format_list_numbered"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        />
        <ToolbarButton
          label="Quote"
          icon="format_quote"
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        />
        <ToolbarButton label="Link" icon="link" active={editor.isActive("link")} onClick={setLink} />
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
