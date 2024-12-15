-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TYPE "public"."category_enum_637cb4b7" AS ENUM('On-ramp', 'Off-ramp');--> statement-breakpoint
CREATE TYPE "public"."category_enum_ad2fad7f" AS ENUM('On-ramp', 'Off-ramp');--> statement-breakpoint
CREATE TYPE "public"."currency_enum_95958a2e" AS ENUM('USD', 'MXN', 'BRL', 'USDC (ETH)', 'USDT (TRX)', 'USDT (ETH)');--> statement-breakpoint
CREATE TYPE "public"."internal_responsible_person_enum_b31b90bc" AS ENUM('Victor', 'Angel', 'Arnold', 'Daniel S');--> statement-breakpoint
CREATE TYPE "public"."operation_type_enum_741ea889" AS ENUM('on_ramp', 'off_ramp');--> statement-breakpoint
CREATE TYPE "public"."owner_enum_a6707072" AS ENUM('user', 'bridge', 'conduit');--> statement-breakpoint
CREATE TYPE "public"."payment_type_enum_7cc3da13" AS ENUM('Third-Party Payment', 'On-Ramp', 'Off-Ramp');--> statement-breakpoint
CREATE TYPE "public"."receiving_currency_type_enum_9f498e43" AS ENUM('stable', 'fiat');--> statement-breakpoint
CREATE TYPE "public"."recieving_method_enum_17b6b816" AS ENUM('Telegram', 'WhatsApp', 'Order Form');--> statement-breakpoint
CREATE TYPE "public"."recipient_currency_enum_9767781c" AS ENUM('USDT (TRX)', 'USD (FIAT)', 'USDT (ETH)', 'USDC (ETH)', 'MXN (FIAT)');--> statement-breakpoint
CREATE TYPE "public"."recipient_currency_enum_fd3db64b" AS ENUM('USDT (TRX)', 'USD (FIAT)', 'USDT (ETH)', 'USDC (ETH)', 'MXN (FIAT)');--> statement-breakpoint
CREATE TYPE "public"."recipient_currency_enum_ff577fa3" AS ENUM('USDT (TRX)', 'USD (FIAT)', 'USDT (ETH)', 'USDC (ETH)', 'MXN (FIAT)');--> statement-breakpoint
CREATE TYPE "public"."sender_currency_enum_06f7d958" AS ENUM('USD (FIAT)', 'USDC (ETH)', 'USDT (ETH)', 'USDT (TRX)', 'MXN (FIAT)');--> statement-breakpoint
CREATE TYPE "public"."sender_currency_enum_1e5c83f7" AS ENUM('USD (FIAT)', 'USDC (ETH)', 'USDT (ETH)', 'USDT (TRX)', 'MXN (FIAT)');--> statement-breakpoint
CREATE TYPE "public"."sender_currency_enum_5b17ffbd" AS ENUM('USD (FIAT)', 'USDC (ETH)', 'USDT (ETH)', 'USDT (TRX)', 'MXN (FIAT)');--> statement-breakpoint
CREATE TYPE "public"."sending_currency_type_enum_f9f3ddac" AS ENUM('stable', 'fiat');--> statement-breakpoint
CREATE TYPE "public"."source_enum_53b14601" AS ENUM('Manual Sheet');--> statement-breakpoint
CREATE TYPE "public"."status_enum_0d232213" AS ENUM('Submitted', 'Raised', 'Sent', 'Received', 'Cancelled', 'Pending');--> statement-breakpoint
CREATE TYPE "public"."status_enum_607af79c" AS ENUM('active', 'inactive', 'deleted');--> statement-breakpoint
CREATE TYPE "public"."status_enum_7892b369" AS ENUM('COMPLETED', 'AWAITING_COMPLIANCE_REVIEW', 'CANCELLED', 'PAYMENT_PROCESSED', 'PROCESSING_PAYMENT', 'AWAITING_FUNDS', 'IN_COMPLIANCE_REVIEW', 'CREATED');--> statement-breakpoint
CREATE TYPE "public"."status_enum_a1daba09" AS ENUM('AWAITING_COMPLIANCE_REVIEW', 'PAYMENT_PROCESSED', 'CANCELLED', 'COMPLETED');--> statement-breakpoint
CREATE TYPE "public"."status_enum_dc69b788" AS ENUM('active', 'updated', 'deleted');--> statement-breakpoint
CREATE TYPE "public"."status_enum_def65b9d" AS ENUM('AWAITING_COMPLIANCE_REVIEW', 'PAYMENT_PROCESSED', 'CANCELLED', 'COMPLETED');--> statement-breakpoint
CREATE TYPE "public"."type_enum_3da41284" AS ENUM('fiat', 'crypto');--> statement-breakpoint
CREATE TYPE "public"."type_enum_adbf729b" AS ENUM('fiat', 'crypto');--> statement-breakpoint
CREATE SEQUENCE "public"."currency_pairs_copy_id_seq1" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Customer_Accounts" (
	"id" serial PRIMARY KEY NOT NULL,
	"business_name" text,
	"account_number" text,
	"business_address" text,
	"swift_code" text,
	"bank_address" text,
	"name_of_bank" text,
	"is_self_account" boolean DEFAULT false,
	"country_of_bank" integer,
	"address_of_bank" text,
	"name_of_intermediary_bank" text,
	"routing_number_of_intermediary_bank" text,
	"business_country" integer,
	"business_city" text,
	"business_state_province" text,
	"business_postal_code" text,
	"organization" text,
	"root_account_id" integer,
	"root_account_name" text,
	"currency" "currency_enum_95958a2e",
	"type" "type_enum_adbf729b",
	"crypto_pub_key" text,
	"external_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"user_id" integer,
	"status" "status_enum_607af79c"
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sumsub_individuals" (
	"applicant_id" text PRIMARY KEY NOT NULL,
	"external_id" text,
	"creation_date" timestamp with time zone,
	"last_review_date" timestamp with time zone,
	"applicant_name" text,
	"applicant_email" text,
	"applicant_phone_number" text,
	"applicant_country" text,
	"reject_type" text,
	"reject_labels" text,
	"custom_tags" text,
	"source_key" text,
	"result" text,
	"applicant_level" text,
	"platform" text,
	"status" text,
	"user_comment" text,
	"client_comment" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "countries" (
	"id" serial PRIMARY KEY NOT NULL,
	"english_short_name_lower_case" text,
	"alpha_2_code" text,
	"alpha_3_code" text,
	"numeric_code" real,
	"iso_3166_2" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "crypto_networks" (
	"name" text NOT NULL,
	"symbol" text NOT NULL,
	"status" "status_enum_607af79c" DEFAULT 'inactive',
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "kpi_dashboard" (
	"id" bigint PRIMARY KEY NOT NULL,
	"campaign_name" text,
	"campaign_owner" text,
	"start_date" text,
	"end_date" text,
	"budget" text,
	"impressions" text,
	"clicks" text,
	"conversions" text,
	"revenue" text,
	"photo" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "conduit_transactions_copy" (
	"id" text NOT NULL,
	"sender" text,
	"effective" date,
	"status" "status_enum_def65b9d",
	"sender_currency" "sender_currency_enum_06f7d958",
	"recipient_currency" "recipient_currency_enum_fd3db64b",
	"created" timestamp with time zone,
	"sender_amount" text,
	"client" text,
	"type" text,
	"purpose" text,
	"recipient_amount" text,
	"recipient" text,
	"fees" real,
	"supporting_docs" text,
	"transaction_hash" text,
	"reference" text,
	"amount_settled" text,
	"revenue" text,
	CONSTRAINT "conduit_transactions_copy_id_key" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "conduit_transactions_copy2" (
	"created" timestamp with time zone,
	"id" text NOT NULL,
	"sender" text,
	"type" text,
	"sender_amount" text,
	"client" text,
	"status" "status_enum_a1daba09",
	"recipient_amount" text,
	"sender_currency" "sender_currency_enum_1e5c83f7",
	"supporting_docs" text,
	"recipient" text,
	"effective" date,
	"transaction_hash" text,
	"recipient_currency" "recipient_currency_enum_9767781c",
	"reference" text,
	"purpose" text,
	"revenue" text,
	"fees" real,
	"amount_settled" text,
	CONSTRAINT "conduit_transactions_copy2_id_key" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "crypto_tokens" (
	"name" text NOT NULL,
	"symbol" text NOT NULL,
	"image_url" text,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"network_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "bridge_transfers" (
	"id" text PRIMARY KEY NOT NULL,
	"state" text,
	"amount" double precision,
	"customer" text,
	"source_payment_rail" text,
	"source_currency" text,
	"destination_payment_rail" text,
	"destination_currency" text,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "currencies" (
	"id" serial PRIMARY KEY NOT NULL,
	"currency_abrev" text,
	"type" "type_enum_3da41284",
	"icon" text,
	"deposit_address" text,
	CONSTRAINT "currencies_currency_abrev_key" UNIQUE("currency_abrev")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fiat_currencies" (
	"name" text NOT NULL,
	"symbol" text NOT NULL,
	"image_url" text,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Order_Data" (
	"id" serial PRIMARY KEY NOT NULL,
	"date_of_request" timestamp with time zone DEFAULT '2024-10-08 16:26:19.406701+00',
	"payment_type" "payment_type_enum_7cc3da13",
	"recieving_method" "recieving_method_enum_17b6b816",
	"amount_sent" numeric DEFAULT '0',
	"txn_id" text,
	"internal_responsible_person" "internal_responsible_person_enum_b31b90bc",
	"status" "status_enum_0d232213",
	"date_payment_sent" timestamp with time zone,
	"notes" text,
	"invoice_file_id" text,
	"sending_account" integer,
	"receiving_account" integer,
	"receipt_file_id" text,
	"txn_hash" text,
	"user_id" text,
	"omad" text,
	"imad" text,
	"settled_amount" integer,
	"organization" text,
	"amount_received" numeric DEFAULT '0',
	"sending_fiat_currency_id" uuid,
	"sending_crypto_token_id" uuid,
	"receiving_fiat_currency_id" uuid,
	"receiving_crypto_token_id" uuid,
	"invoice_file_url" text,
	"user_email" text,
	"is_third_party" boolean DEFAULT false,
	"purpose" text,
	"receipt_file_url" text,
	"deleted_at" timestamp with time zone,
	"sender_business_name" text,
	"last4_sender_bank_account_number" text,
	"user_id_ext" integer,
	"platform_fee" double precision DEFAULT '0',
	"developer_fee" double precision DEFAULT '0'
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "products" (
	"id" bigint PRIMARY KEY NOT NULL,
	"name" text,
	"quantity" integer,
	"unit_price_cents" integer,
	"created_at" timestamp,
	"updated_at" timestamp,
	"image_url" text,
	"part_number" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "bridge_customers" (
	"id" text PRIMARY KEY NOT NULL,
	"type" text,
	"first_name" text,
	"last_name" text,
	"email" text,
	"status" text,
	"created_at" timestamp,
	"updated_at" timestamp,
	"has_accepted_terms_of_service" boolean
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "order_types" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_type_name" text,
	"fee" numeric(15, 4) DEFAULT '0'
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "currency_pairs" (
	"id" serial PRIMARY KEY NOT NULL,
	"sending_currency" text,
	"sending_currency_type" "sending_currency_type_enum_f9f3ddac",
	"receiving_currency" text,
	"receiving_currency_type" "receiving_currency_type_enum_9f498e43",
	"fee_total" numeric(15, 4) DEFAULT '0',
	"category" "category_enum_637cb4b7"
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ramp_transfers" (
	"id" text PRIMARY KEY NOT NULL,
	"state" text,
	"amount" double precision,
	"customer" text,
	"source_payment_rail" text,
	"source_currency" text,
	"destination_payment_rail" text,
	"destination_currency" text,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ramp_customers" (
	"id" text PRIMARY KEY NOT NULL,
	"type" text,
	"first_name" text,
	"last_name" text,
	"email" text,
	"status" text,
	"created_at" timestamp,
	"updated_at" timestamp,
	"has_accepted_terms_of_service" boolean
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "bridge_transfers_auto" (
	"id" text PRIMARY KEY NOT NULL,
	"state" text,
	"amount" double precision,
	"customer" text,
	"source_payment_rail" text,
	"source_currency" text,
	"destination_payment_rail" text,
	"destination_currency" text,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "currency_trading_pairs" (
	"receiving_currency" text,
	"fee_total" numeric(15, 4) DEFAULT '0',
	"category" "category_enum_ad2fad7f",
	"id" integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY (sequence name "currency_pairs_copy_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"sending_currency" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "wallets" (
	"owner" "owner_enum_a6707072",
	"address" text NOT NULL,
	"note" text,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"token_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"organization_id" uuid,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"hashed_api_key" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "volume_onetime_payments" (
	"day" date PRIMARY KEY NOT NULL,
	"arbitrum" double precision,
	"bitcoin" double precision,
	"bsc" double precision,
	"ethereum" double precision,
	"gnosis" double precision,
	"optimism" double precision,
	"polygon" double precision,
	"sepolia" double precision,
	"sol" double precision
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "volume_subscription_payments" (
	"day" date PRIMARY KEY NOT NULL,
	"arbitrum" double precision,
	"bitcoin" double precision,
	"bsc" double precision,
	"ethereum" double precision,
	"gnosis" double precision,
	"optimism" double precision,
	"polygon" double precision,
	"sepolia" double precision,
	"sol" double precision
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "organizations" (
	"display_name" text,
	"logo_url" text,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "conduit_transactions" (
	"created" timestamp with time zone,
	"id" text PRIMARY KEY NOT NULL,
	"client" text,
	"type" text,
	"status" "status_enum_7892b369",
	"effective" date,
	"sender" text,
	"sender_amount" text,
	"sender_currency" "sender_currency_enum_5b17ffbd",
	"recipient" text,
	"recipient_amount" text,
	"recipient_currency" "recipient_currency_enum_ff577fa3",
	"fees" real,
	"purpose" text,
	"supporting_docs" text,
	"reference" text,
	"transaction_hash" text,
	"amount_settled" text,
	"revenue" text,
	"source" "source_enum_53b14601"
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "currency_pairs_2" (
	"fiat_currency_id" uuid NOT NULL,
	"crypto_token_id" uuid NOT NULL,
	"operation_type" "operation_type_enum_741ea889" NOT NULL,
	"fee" numeric(15, 8) DEFAULT '0' NOT NULL,
	CONSTRAINT "fiat_currency_crypto_token_pairs_pkey" PRIMARY KEY("fiat_currency_id","crypto_token_id","operation_type")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "volume_bridge_transfers" (
	"date" date NOT NULL,
	"bridge_transfer_status" text NOT NULL,
	"bridge_transfer_count" integer,
	"bridge_transfer_amount" double precision,
	CONSTRAINT "volume_bridge_transfers_pkey" PRIMARY KEY("date","bridge_transfer_status")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Customer_Accounts" ADD CONSTRAINT "Customer_Accounts_business_country_fkey" FOREIGN KEY ("business_country") REFERENCES "public"."countries"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Customer_Accounts" ADD CONSTRAINT "Customer_Accounts_country_of_bank_fkey" FOREIGN KEY ("country_of_bank") REFERENCES "public"."countries"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Customer_Accounts" ADD CONSTRAINT "Customer_Accounts_root_account_id_fkey" FOREIGN KEY ("root_account_id") REFERENCES "public"."Customer_Accounts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Customer_Accounts" ADD CONSTRAINT "Customer_Accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "crypto_tokens" ADD CONSTRAINT "crypto_tokens_network_id_fkey" FOREIGN KEY ("network_id") REFERENCES "public"."crypto_networks"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Order_Data" ADD CONSTRAINT "Order_Data_receiving_account_fkey" FOREIGN KEY ("receiving_account") REFERENCES "public"."Customer_Accounts"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Order_Data" ADD CONSTRAINT "Order_Data_sending_account_fkey" FOREIGN KEY ("sending_account") REFERENCES "public"."Customer_Accounts"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Order_Data" ADD CONSTRAINT "Order_Data_sending_fiat_currency_id_fkey" FOREIGN KEY ("sending_fiat_currency_id") REFERENCES "public"."fiat_currencies"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Order_Data" ADD CONSTRAINT "Order_Data_sending_crypto_token_id_fkey" FOREIGN KEY ("sending_crypto_token_id") REFERENCES "public"."crypto_tokens"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Order_Data" ADD CONSTRAINT "Order_Data_receiving_fiat_currency_id_fkey" FOREIGN KEY ("receiving_fiat_currency_id") REFERENCES "public"."fiat_currencies"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Order_Data" ADD CONSTRAINT "Order_Data_receiving_crypto_token_id_fkey" FOREIGN KEY ("receiving_crypto_token_id") REFERENCES "public"."crypto_tokens"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Order_Data" ADD CONSTRAINT "Order_Data_user_id_ext_fkey" FOREIGN KEY ("user_id_ext") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "currency_trading_pairs" ADD CONSTRAINT "currency_pairs_copy_receiving_currency_fkey" FOREIGN KEY ("receiving_currency") REFERENCES "public"."currencies"("currency_abrev") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "currency_trading_pairs" ADD CONSTRAINT "currency_pairs_copy_sending_currency_fkey" FOREIGN KEY ("sending_currency") REFERENCES "public"."currencies"("currency_abrev") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "wallets" ADD CONSTRAINT "wallets_token_id_fkey" FOREIGN KEY ("token_id") REFERENCES "public"."crypto_tokens"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "users_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "currency_pairs_2" ADD CONSTRAINT "fiat_currency_crypto_token_pairs_sending_currency_fkey" FOREIGN KEY ("fiat_currency_id") REFERENCES "public"."fiat_currencies"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "currency_pairs_2" ADD CONSTRAINT "fiat_currency_crypto_token_pairs_receiving_currency_fkey" FOREIGN KEY ("crypto_token_id") REFERENCES "public"."crypto_tokens"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

*/