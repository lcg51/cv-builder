#!/bin/bash

# ImageMagick WebP Conversion Script
# Often provides better compression than Sharp

echo "🖼️  ImageMagick WebP Conversion Script"
echo "========================================"

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "❌ ImageMagick not found. Installing..."
    brew install imagemagick
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install ImageMagick. Please install manually:"
        echo "   brew install imagemagick"
        exit 1
    fi
fi

echo "✅ ImageMagick found"

# Directory containing images
ASSETS_DIR="src/assets"
cd "$(dirname "$0")"

# Check if assets directory exists
if [ ! -d "$ASSETS_DIR" ]; then
    echo "❌ Assets directory not found: $ASSETS_DIR"
    exit 1
fi

# Convert all JPG files to WebP
echo ""
echo "🔄 Converting JPG images to WebP..."

for jpg_file in "$ASSETS_DIR"/*.jpg; do
    if [ -f "$jpg_file" ]; then
        filename=$(basename "$jpg_file" .jpg)
        webp_file="$ASSETS_DIR/$filename.webp"
        
        echo "Converting: $filename.jpg → $filename.webp"
        
        # Get original file size
        original_size=$(stat -f%z "$jpg_file")
        
        # Convert with aggressive compression
        convert "$jpg_file" \
            -quality 70 \
            -define webp:method=6 \
            -define webp:pass=6 \
            -define webp:target-size=0 \
            -define webp:auto-filter=1 \
            -define webp:sharp-yuv=1 \
            -define webp:thread-level=1 \
            "$webp_file"
        
        if [ $? -eq 0 ]; then
            # Get WebP file size
            webp_size=$(stat -f%z "$webp_file")
            
            # Calculate savings
            if [ $webp_size -lt $original_size ]; then
                savings=$(( (original_size - webp_size) * 100 / original_size ))
                echo "✅ $filename.webp created"
                echo "   JPG: $((original_size / 1024 / 1024)) MB"
                echo "   WebP: $((webp_size / 1024 / 1024)) MB"
                echo "   Savings: ${savings}% 🎉"
            else
                echo "⚠️  WebP is larger, trying more aggressive compression..."
                
                # Try even more aggressive compression
                convert "$jpg_file" \
                    -quality 50 \
                    -define webp:method=6 \
                    -define webp:pass=6 \
                    -define webp:target-size=0 \
                    -define webp:auto-filter=1 \
                    -define webp:sharp-yuv=1 \
                    -define webp:thread-level=1 \
                    "$webp_file"
                
                webp_size=$(stat -f%z "$webp_file")
                
                if [ $webp_size -lt $original_size ]; then
                    savings=$(( (original_size - webp_size) * 100 / original_size ))
                    echo "✅ Aggressive compression successful: ${savings}% savings"
                else
                    echo "❌ WebP conversion failed - removing file"
                    rm "$webp_file"
                fi
            fi
        else
            echo "❌ Failed to convert $filename.jpg"
        fi
        
        echo ""
    fi
done

echo "🎉 Conversion complete!"
echo ""
echo "📁 Your optimized images are now in: $ASSETS_DIR"
echo "🌐 WebP images will be served to modern browsers"
echo "📱 JPG images will be used as fallbacks for older browsers"
echo ""
echo "💡 Next steps:"
echo "   1. Test your app to ensure images load correctly"
echo "   2. Check browser DevTools to verify WebP is being served"
echo "   3. Monitor performance improvements in Lighthouse"
