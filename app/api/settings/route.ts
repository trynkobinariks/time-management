import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUserSettings, updateUserSettings } from '@/lib/supabase/db';

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const settings = await getUserSettings(user.id);
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json(
      { message: 'Error retrieving user settings', error: String(error) },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const requestData = await request.json();

    // Validate the request body
    const requiredFields = [
      'working_hours_per_day',
      'working_days_per_week',
      'internal_hours_limit',
      'commercial_hours_limit',
    ];
    for (const field of requiredFields) {
      if (requestData[field] === undefined || requestData[field] === null) {
        return NextResponse.json(
          { message: `${field} is required` },
          { status: 400 },
        );
      }

      // Ensure values are numeric and positive
      if (typeof requestData[field] !== 'number' || requestData[field] <= 0) {
        return NextResponse.json(
          { message: `${field} must be a positive number` },
          { status: 400 },
        );
      }
    }

    // Specific validations
    if (requestData.working_days_per_week > 7) {
      return NextResponse.json(
        { message: 'working_days_per_week cannot exceed 7' },
        { status: 400 },
      );
    }

    if (requestData.working_hours_per_day > 24) {
      return NextResponse.json(
        { message: 'working_hours_per_day cannot exceed 24' },
        { status: 400 },
      );
    }

    const settings = await updateUserSettings(user.id, {
      working_hours_per_day: requestData.working_hours_per_day,
      working_days_per_week: requestData.working_days_per_week,
      internal_hours_limit: requestData.internal_hours_limit,
      commercial_hours_limit: requestData.commercial_hours_limit,
    });

    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json(
      { message: 'Error updating user settings', error: String(error) },
      { status: 500 },
    );
  }
}
