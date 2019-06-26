---
title: 'Markdown Tutorial'
thumbnail: /uploads/image.jpg
draft: false
description: "A quick and simple markdown tutorial"
---

Guide from [Markdown syntax guide by Atlassian](https://confluence.atlassian.com/bitbucketserver/markdown-syntax-guide-776639995.html)

### Headings

```md
# This is an H1
## This is an H2
###### This is an H6

This is also an H1
==================

This is also an H2
------------------
```

### Paragraphs
Paragraphs are separated by empty lines. To create a new paragraph, press <return> twice.

```md
Paragraph 1

Paragraph 2
```

### Character styles

```md
*Italic characters* 
_Italic characters_
**bold characters**
__bold characters__
~~strikethrough text~~
```

### Unordered list

```md
*  Item 1
*  Item 2
*  Item 3
    *  Item 3a
    *  Item 3b
    *  Item 3c
Ordered list
1.  Step 1
2.  Step 2
3.  Step 3
    1.  Step 3.1
    2.  Step 3.2
    3.  Step 3.3
List in list
1.  Step 1
2.  Step 2
3.  Step 3
    *  Item 3a
  *  Item 3b
  *  Item 3c
```

### Quotes or citations
Introducing my quote:

```
> Neque porro quisquam est qui 
> dolorem ipsum quia dolor sit amet, 
> consectetur, adipisci velit...
```

### Inline code characters

```md
Use the backtick to refer to a `function()`.
 
There is a literal ``backtick (`)`` here.
```

### Code blocks

````md
Indent every line of the block by at least 4 spaces.

This is a normal paragraph:

    This is a code block.
    With multiple lines.

Alternatively, you can use 3 backtick quote marks before and after the block, like this:

```
This is a code block
```

To add syntax highlighting to a code block, add the name of the language immediately
after the backticks: 

```javascript
var oldUnload = window.onbeforeunload;
window.onbeforeunload = function() {
    saveCoverage();
    if (oldUnload) {
        return oldUnload.apply(this, arguments);
    }
};
```
````

Within a code block, ampersands (&) and angle brackets (< and >) are automatically converted into HTML entities.

### Links to external websites

```md
This is [an example](http://www.example.com/) inline link.

[This link](http://example.com/ "Title") has a title attribute.

Links are also auto-detected in text: http://example.com/
```

### CSS classes {.text-center}

This is a paragraph with a class of "text-center" added
{.text-center}

```md
### This is a centered heading {.text-center}

This is a paragraph with a class of "text-center" added
{.text-center}
```

---
For more information visit:

[www.markdowntutorial.com](https://www.markdowntutorial.com/)