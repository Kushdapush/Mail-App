import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { parse } from "csv-parse/sync";
import { unlink } from "fs/promises";
import { join } from "path";
import { sendEmails } from "@/lib/email";

// In a real app, store this in a database
let receivers: string[] = ['kushagragupta625@gmail.com'];

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('emailList') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }
    
    // Check if file is CSV
    if (!file.name.endsWith('.csv')) {
      return NextResponse.json(
        { error: 'Only CSV files are allowed' },
        { status: 400 }
      );
    }

    // Create directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'tmp');
    try {
      await writeFile(join(uploadDir, '.keep'), '');
    } catch (error) {
      // Directory might not exist
      const fs = require('fs');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
    }
    
    // Save the file
    const filePath = join(uploadDir, file.name);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);
    
    // Process CSV
    try {
      const content = buffer.toString();
      const records = parse(content, {
        columns: true,
        skip_empty_lines: true,
      });
      
      // Extract emails from CSV
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      for (const record of records) {
        const email = record.email || Object.values(record)[0];
        if (email && typeof email === 'string' && emailRegex.test(email)) {
          receivers.push(email);
        }
      }
      
      // Send emails
      await sendEmails(receivers);
      
      // Delete the file
      await unlink(filePath);
      
      return NextResponse.json({ 
        success: true,
        message: 'Email list processed and emails sent successfully',
      });
    } catch (error) {
      console.error('Error processing CSV:', error);
      // Try to clean up the file
      try {
        await unlink(filePath);
      } catch (e) {
        // Ignore errors during cleanup
      }
      
      return NextResponse.json(
        { error: 'Failed to process CSV file' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in /api/mail/upload:', error);
    return NextResponse.json(
      { error: 'Failed to process upload' },
      { status: 500 }
    );
  }
}