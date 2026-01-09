# Stilbaai Gallery - Artist Product Submission Portal

A Next.js web application that allows artists to submit their artwork for sale through the Stilbaai Gallery. Artists can register, complete their profile, and submit products that are automatically added to the gallery's WooCommerce store as drafts for review.

## Features

- **User Authentication** - Secure sign-up and sign-in with Better Auth
- **Artist Profiles** - Complete profile with personal, banking, and delivery information
- **Product Submissions** - Submit artwork with images, pricing, and specifications
- **WooCommerce Integration** - Products are automatically created as drafts in WordPress
- **Image Compression** - Images are compressed to max 1920px before upload
- **Email Notifications** - Admin receives email when new products are submitted
- **55% Artist Payout** - Transparent pricing with automatic payout calculation

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Database**: MySQL with [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication**: [Better Auth](https://www.better-auth.com/)
- **Email**: Nodemailer

## Getting Started

### Prerequisites

- Node.js 18+
- MySQL database
- WordPress site with WooCommerce and REST API enabled

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-repo/stilbaai-gallery-product-submissions.git
cd stilbaai-gallery-product-submissions
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file based on `.env.example`:

```env
# Database
DATABASE_URL=mysql://user:password@localhost:3306/stilbaai_gallery

# Better Auth
BETTER_AUTH_SECRET=your-secret-key
BETTER_AUTH_URL=http://localhost:3000

# WordPress / WooCommerce
WP_USERNAME=your-wp-username
WP_PASSWORD=your-wp-application-password
WP_URL=https://your-site.com/wp-json/wp/v2
WP_MEDIA_URL=https://your-site.com/wp-json/wp/v2/media
WP_PRODUCTS_URL=https://your-site.com/wp-json/wc/v3/products
WP_IMAGE_UPLOAD_URL=https://your-site.com/wp-json/wp/v2/media
WC_CONSUMER_KEY=ck_your_consumer_key
WC_CONSUMER_SECRET=cs_your_consumer_secret

# Email (SMTP)
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USERNAME=your-email@example.com
EMAIL_PASSWORD=your-email-password
```

4. Run database migrations:

```bash
npm run db:push
```

5. Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Database Commands

```bash
# Generate migrations from schema changes
npm run db:generate

# Apply migrations
npm run db:migrate

# Push schema directly (development)
npm run db:push

# Open Drizzle Studio
npm run db:studio
```

## Project Structure

```
├── app/
│   ├── (auth)/           # Authentication pages (sign-in, sign-up)
│   ├── (dashboard)/      # Protected dashboard pages
│   │   ├── profile/      # Artist profile management
│   │   └── products/     # Product submissions
│   ├── api/              # API routes (auth)
│   └── layout.tsx        # Root layout
├── components/
│   ├── ui/               # shadcn/ui components
│   ├── dashboard-nav.tsx # Navigation component
│   ├── product-form.tsx  # Product submission form
│   └── profile-form.tsx  # Profile form
├── lib/
│   ├── actions/          # Server actions
│   ├── db/               # Database configuration and schema
│   ├── auth.ts           # Better Auth configuration
│   └── woocommerce.ts    # WooCommerce API client
└── drizzle/              # Database migrations
```

## User Flow

1. **Sign Up** - Create an account with email and password
2. **Complete Profile** - Fill in personal details, banking info, and delivery address
3. **Submit Products** - Add artwork with images, pricing, and specifications
4. **Review** - Gallery admin reviews and publishes approved products

## Product Submission Details

When submitting a product, artists provide:

- **Title** - Artwork name
- **Selling Price** - Full retail price (artist receives 55%)
- **Artist Name** - Added as WooCommerce category
- **Exhibition Name** - Added as WooCommerce tag (optional)
- **Descriptions** - Short and full descriptions (optional)
- **Specifications** - Length, width (mm), and medium
- **Images** - Up to 3 images (compressed automatically)

## License

No license. Free to use and modify.
