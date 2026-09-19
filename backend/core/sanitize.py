"""Shared HTML sanitization for admin-authored rich text."""

import nh3

_ALLOWED_TAGS = {"p", "strong", "em", "h2", "h3", "ul", "ol", "li", "blockquote", "a"}
_ALLOWED_ATTRIBUTES = {"a": {"href", "target"}}


def sanitize_article_html(html):
    """Strip everything outside the rich text editor's constrained output.

    Keep this allow-list in sync with the RichTextEditor's Tiptap extensions
    (frontend/src/admin/components/RichTextEditor.jsx) -- widening one
    without the other either breaks legitimate formatting or lets unintended
    tags/attributes reach the public page as live HTML.
    """
    if not html:
        return ""
    return nh3.clean(html, tags=_ALLOWED_TAGS, attributes=_ALLOWED_ATTRIBUTES)
