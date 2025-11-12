# Book Cover Images Guide

## How to Find and Implement Actual Book Cover Images

### Step 1: Search for Book Covers

Go to **images.google.com** and search using these exact terms:

#### For "The Brain: The Story of You"
**Search Terms:**
- `"The Brain: The Story of You" "David Eagleman" cover`
- `"The Brain: The Story of You" book cover`
- `David Eagleman brain book cover`

#### For "Atheism: A Wonderful World Without Religion"
**Search Terms:**
- `"Atheism: A Wonderful World Without Religion" "Tom Miles" cover`
- `"Atheism" "Tom Miles" book cover`
- `atheism philosophy book cover`

#### For "Applying the Cornell Method"
**Search Terms:**
- `"Cornell Method" study guide cover`
- `"Cornell Method" note taking book cover`
- `study method book cover`

### Step 2: Find High-Quality Images

Look for:
- **High resolution** (at least 400x600 pixels)
- **Clear, readable** book covers
- **Professional quality** images
- **Front covers** (not spines or back covers)

### Step 3: Get Image URLs

1. **Right-click** on the selected image
2. **Select "Copy image address"** or "Copy image URL"
3. **Save the URL** for implementation

### Step 4: Replace Image URLs in Code

#### Files to Update:

1. **`src/pages/Books.jsx`** (3 locations)
   - Line ~15: Atheism book cover
   - Line ~40: The Brain book cover
   - Line ~65: Cornell Method book cover

2. **`src/pages/books/atheism.jsx`** (1 location)
   - Line ~25: Atheism book cover in content page

3. **`src/pages/books/the-brain-story-content.jsx`** (1 location)
   - Line ~35: The Brain book cover in content page

#### Example Replacement:

```jsx
// Replace this:
src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80"

// With your actual book cover URL:
src="https://your-actual-book-cover-url-here.com/image.jpg"
```

### Step 5: Test the Implementation

1. **Save the files**
2. **Test locally** to ensure images load properly
3. **Check mobile responsiveness**
4. **Verify image quality** on different screen sizes

### Step 6: Commit and Deploy

```bash
git add .
git commit -m "Replace placeholder images with actual book covers"
git push origin master
```

## Important Notes

### Copyright Considerations:
- **Fair Use**: Book covers are generally considered fair use for educational/review purposes
- **Attribution**: Consider adding image credits if required
- **Quality**: Use high-quality images for professional appearance

### Image Optimization:
- **Size**: Aim for 400-600px width for optimal performance
- **Format**: JPG or PNG formats work best
- **Loading**: Images should load quickly

### Fallback Strategy:
- Keep the current Unsplash images as fallbacks
- Test with actual book covers
- If issues arise, revert to placeholder images

## Recommended Search Strategy

1. **Start with exact book title + author**
2. **Add "cover" or "book cover"** to narrow results
3. **Look for official publisher images** when possible
4. **Avoid low-quality or watermarked images**
5. **Test multiple options** to find the best fit

## Example URLs to Look For

- Amazon product images
- Publisher website images
- Book review site images
- Author website images
- Library catalog images

---

**Note**: This guide helps you implement actual book covers while maintaining the professional appearance and functionality of your website.
