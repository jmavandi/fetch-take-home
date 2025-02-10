# 🐕 Fetch Dog Adoption App

Hey there! This is my take on Fetch's frontend challenge - a dog adoption app built with Next.js that helps connect shelter dogs with their forever homes.

## 🎯 What It Does

- Log in with your name and email (no account needed)
- Browse through adoptable dogs with a bunch of filtering options:
  - Search by breed
  - Filter by age (from puppies to senior dogs)
  - Find dogs in your area using ZIP codes
  - Sort alphabetically (A-Z or Z-A)
- Like your favorite pups and get matched with one to adopt!

## 🛠️ Built With

- [Next.js 14](https://nextjs.org/) - React framework
- [TailwindCSS](https://tailwindcss.com/) - For styling
- [React Icons](https://react-icons.github.io/react-icons/) - For the cute icons
- [Vercel](https://vercel.com) - For deployment

## 🚀 Live Demo

Check out the live site: [Fetch Dog Adoption](https://fetch-take-home-nu.vercel.app/)

## 💻 Running Locally

Want to run this on your machine? Here's how:

```bash
# Clone the repo
git clone https://github.com/jmavandi/fetch-take-home.git

# Install dependencies
npm install

# Start the development server
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser to see the app!

## 📝 Notes

- The app uses Fetch's API (base URL: https://frontend-take-home-service.fetch.com)
- Authentication is handled via HttpOnly cookies
- All API requests need to include credentials
- The search results are paginated with a max of 10,000 dogs per query

## 🙋‍♂️ About This Project

This was built as part of Fetch's frontend take-home challenge. The goal was to create a user-friendly interface for browsing adoptable dogs and implementing the match-making feature.

Feel free to check out the code and let me know what you think! 🐾
