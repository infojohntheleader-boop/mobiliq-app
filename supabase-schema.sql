-- Mobiliq Supabase Schema
-- Run this in the Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Organizations table
CREATE TABLE IF NOT EXISTS "Organization" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "name" TEXT NOT NULL,
  "slug" TEXT UNIQUE NOT NULL,
  "plan" TEXT NOT NULL DEFAULT 'starter',
  "brandColor" TEXT DEFAULT '#6366f1',
  "logo" TEXT,
  "phone" TEXT,
  "address" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Users table
CREATE TABLE IF NOT EXISTS "User" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "email" TEXT NOT NULL,
  "password" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "role" TEXT NOT NULL DEFAULT 'owner',
  "orgId" UUID NOT NULL REFERENCES "Organization"("id") ON DELETE CASCADE,
  "sessionToken" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE("email", "orgId")
);

-- Services table
CREATE TABLE IF NOT EXISTS "Service" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "name" TEXT NOT NULL,
  "description" TEXT,
  "price" DECIMAL(10,2) NOT NULL DEFAULT 0,
  "duration" INTEGER NOT NULL DEFAULT 60,
  "orgId" UUID NOT NULL REFERENCES "Organization"("id") ON DELETE CASCADE,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Service Addons table
CREATE TABLE IF NOT EXISTS "ServiceAddon" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "name" TEXT NOT NULL,
  "price" DECIMAL(10,2) NOT NULL DEFAULT 0,
  "serviceId" UUID NOT NULL REFERENCES "Service"("id") ON DELETE CASCADE,
  "orgId" UUID NOT NULL REFERENCES "Organization"("id") ON DELETE CASCADE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Bookings table
CREATE TABLE IF NOT EXISTS "Booking" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "customerName" TEXT NOT NULL,
  "customerEmail" TEXT NOT NULL,
  "customerPhone" TEXT,
  "vehicleMake" TEXT,
  "vehicleModel" TEXT,
  "vehicleYear" INTEGER,
  "vehicleColor" TEXT,
  "serviceId" UUID REFERENCES "Service"("id"),
  "serviceName" TEXT,
  "servicePrice" DECIMAL(10,2) DEFAULT 0,
  "date" DATE NOT NULL,
  "time" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "notes" TEXT,
  "orgId" UUID NOT NULL REFERENCES "Organization"("id") ON DELETE CASCADE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Booking Addons table
CREATE TABLE IF NOT EXISTS "BookingAddon" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "bookingId" UUID NOT NULL REFERENCES "Booking"("id") ON DELETE CASCADE,
  "addonName" TEXT NOT NULL,
  "addonPrice" DECIMAL(10,2) NOT NULL DEFAULT 0,
  "orgId" UUID NOT NULL REFERENCES "Organization"("id") ON DELETE CASCADE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- UpdatedAt triggers
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ DECLARE
  t TEXT;
BEGIN
  FOR t IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' LOOP
    EXECUTE format('CREATE TRIGGER set_updated_at BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION update_updated_at()', t);
  END LOOP;
END $$;

-- RLS Policies
ALTER TABLE "Organization" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Service" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ServiceAddon" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Booking" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "BookingAddon" ENABLE ROW LEVEL SECURITY;

-- Organization: anyone can read for public slug pages
CREATE POLICY "Org public read" ON "Organization" FOR SELECT USING (true);

-- User policies (service role bypasses RLS, these are for anon/anon-key)
CREATE POLICY "User read own" ON "User" FOR SELECT USING (true);
CREATE POLICY "User insert" ON "User" FOR INSERT WITH CHECK (true);
CREATE POLICY "User update" ON "User" FOR UPDATE USING (true);

-- Service policies
CREATE POLICY "Service read" ON "Service" FOR SELECT USING (true);
CREATE POLICY "Service insert" ON "Service" FOR INSERT WITH CHECK (true);
CREATE POLICY "Service update" ON "Service" FOR UPDATE USING (true);
CREATE POLICY "Service delete" ON "Service" FOR DELETE USING (true);

-- ServiceAddon policies
CREATE POLICY "Addon read" ON "ServiceAddon" FOR SELECT USING (true);
CREATE POLICY "Addon insert" ON "ServiceAddon" FOR INSERT WITH CHECK (true);
CREATE POLICY "Addon update" ON "ServiceAddon" FOR UPDATE USING (true);
CREATE POLICY "Addon delete" ON "ServiceAddon" FOR DELETE USING (true);

-- Booking policies
CREATE POLICY "Booking read" ON "Booking" FOR SELECT USING (true);
CREATE POLICY "Booking insert" ON "Booking" FOR INSERT WITH CHECK (true);
CREATE POLICY "Booking update" ON "Booking" FOR UPDATE USING (true);
CREATE POLICY "Booking delete" ON "Booking" FOR DELETE USING (true);

-- BookingAddon policies
CREATE POLICY "BookingAddon read" ON "BookingAddon" FOR SELECT USING (true);
CREATE POLICY "BookingAddon insert" ON "BookingAddon" FOR INSERT WITH CHECK (true);
CREATE POLICY "BookingAddon delete" ON "BookingAddon" FOR DELETE USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_org ON "User"("orgId");
CREATE INDEX IF NOT EXISTS idx_service_org ON "Service"("orgId");
CREATE INDEX IF NOT EXISTS idx_booking_org ON "Booking"("orgId");
CREATE INDEX IF NOT EXISTS idx_booking_date ON "Booking"("date");
CREATE INDEX IF NOT EXISTS idx_org_slug ON "Organization"("slug");
