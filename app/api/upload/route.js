import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const formData = await req.formData();
    
    // Collect all files from FormData
    const files = [];
    for (const [key, value] of formData.entries()) {
      if (value && typeof value === 'object' && typeof value.arrayBuffer === 'function') {
        files.push(value);
      }
    }

    if (files.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No image files provided' },
        { status: 400 }
      );
    }

    const uploadedUrls = [];

    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    let canWriteToDisk = true;
    try {
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
    } catch (e) {
      console.warn('Could not create public/uploads folder on disk, falling back to base64:', e.message);
      canWriteToDisk = false;
    }

    for (const file of files) {
      // Validate file type
      const mimeType = file.type || 'image/jpeg';
      if (!mimeType.startsWith('image/')) {
        continue;
      }

      const buffer = Buffer.from(await file.arrayBuffer());

      if (canWriteToDisk) {
        try {
          const extension = mimeType.split('/')[1]?.replace('jpeg', 'jpg') || 'jpg';
          const cleanExt = extension.replace(/[^a-z0-9]/gi, '').toLowerCase() || 'jpg';
          const filename = `kick-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${cleanExt}`;
          const filePath = path.join(uploadsDir, filename);

          await fs.promises.writeFile(filePath, buffer);
          uploadedUrls.push(`/uploads/${filename}`);
          continue;
        } catch (err) {
          console.warn('Failed writing file to disk, converting to base64 fallback:', err.message);
        }
      }

      // Fallback to base64 Data URL if filesystem is read-only
      const base64 = buffer.toString('base64');
      uploadedUrls.push(`data:${mimeType};base64,${base64}`);
    }

    if (uploadedUrls.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No valid images could be processed' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `${uploadedUrls.length} image(s) uploaded successfully`,
      urls: uploadedUrls,
      url: uploadedUrls[0]
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'File upload failed' },
      { status: 500 }
    );
  }
}
