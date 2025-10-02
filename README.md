# 🌍 AI Travel Planner

**Discover India Like Never Before** - An intelligent travel companion that crafts personalized itineraries using advanced AI technology. Simply describe your dream vacation, and our system generates detailed day-by-day plans complete with attractions, local cuisine recommendations, safety guidance, and interactive maps. Whether you're planning a spiritual journey through Rajasthan, exploring Kerala's backwaters, or discovering Mumbai's vibrant street life, the AI Travel Planner transforms your travel dreams into actionable, well-structured adventures.

<p>
   <img src="https://raw.githubusercontent.com/MVH31/guvi_travel_planner/refs/heads/main/frontend/public/logo.svg" width="50" height="50"/>
</p>

## ✨ Core Features

- 🤖 **AI-Powered Itinerary Generation** - Leverages AI to create personalized travel plans based on your preferences and requirements
- 🔐 **Full User Authentication** - Secure user registration and login system with JWT token-based authentication
- 👤 **Profile Page for Saved Itineraries** - Personal dashboard to view, manage, and delete your saved travel plans
- 🗺️ **Multi-City Route Visualization on Google Maps** - Interactive maps showing your journey with attractions and route planning
- 🔗 **Smart Booking Links** - Integrated booking suggestions and travel resource links for seamless trip planning
- 📱 **Responsive Design** - Modern, mobile-first interface with dark theme and intuitive navigation
- 🛡️ **Safety Information** - AI-generated safety tips and emergency contacts for each destination

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern component-based UI library
- **Vite** - Fast build tool and development server
- **React Router DOM** - Client-side routing and navigation
- **CSS3** - Custom styling with modern design system

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **JWT** - JSON Web Token authentication
- **bcryptjs** - Password hashing and security

### Databases
- **PostgreSQL with Prisma** - User data management with type-safe database access
- **MongoDB with Mongoose** - Itinerary storage with flexible document structure

### External APIs
- **OpenAI** - Advanced AI for intelligent itinerary generation
- **Google Maps API** - Interactive mapping and location services

## 🚀 Getting Started

Follow these step-by-step instructions to set up the AI Travel Planner on your local machine.

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **PostgreSQL** database
- **MongoDB** database
- **Google Cloud Platform** account (for Gemini AI and Maps APIs)

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   Create a `.env` file in the backend directory with the following variables:
   ```env
   API_KEY=your_open_ai_api_key_here
   MONGO_URI=mongodb://localhost:27017/travel-planner
   DATABASE_URL=postgresql://username:password@localhost:5432/travel_planner
   JWT_SECRET=your_super_secret_jwt_key_here
   ```

4. **Set up databases:**
   ```bash
   # Run Prisma migrations for PostgreSQL
   npx prisma migrate dev
   
   # Generate Prisma client
   npx prisma generate
   ```

5. **Start the backend server:**
   ```bash
   npm start
   ```
   The backend will run on `http://localhost:3001`

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   Create a `.env` file in the frontend directory with the following variable:
   ```env
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

### API Keys Setup

1. **Google Gemini AI API:**
   - Visit [Developer OpenAI](https://platform.openai.com/settings/organization/api-keys)
   - Create a new API key for OpenAI
   - Add it to your backend `.env` file

2. **Google Maps API:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Enable Maps JavaScript API
   - Create credentials and add to frontend `.env` file

3. **Database URLs:**
   - **MongoDB:** Set up a local MongoDB instance or use MongoDB Atlas
   - **PostgreSQL:** Set up a local PostgreSQL database or use a cloud service

## 📁 Project Structure

```
travel-itinerary-app/
├── backend/
│   ├── routes/          # API route handlers
│   ├── models/          # Database models
│   ├── middleware/      # Authentication middleware
│   ├── prisma/          # Database schema and migrations
│   └── index.js         # Server entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable React components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React context providers
│   │   └── styles/      # CSS stylesheets
│   ├── public/          # Static assets
│   └── index.html       # HTML template
└── README.md
```

## 🎯 Usage

1. **Register/Login:** Create an account or log in to access the planner
2. **Generate Itinerary:** Describe your travel preferences and let AI create your plan
3. **View Details:** Explore your itinerary with maps, attractions, and recommendations
4. **Manage Plans:** Save, view, and delete itineraries from your profile page
5. **Plan Your Trip:** Use the detailed information to book and organize your travel

## 🔮 Future Enhancements

- 🛒 **Live Booking API Integration** - Direct integration with hotels, flights, and activity booking platforms
- 🔄 **Dynamic Re-planning** - Real-time itinerary adjustments based on weather, events, or user preferences
- 📊 **Travel Analytics** - Personal travel statistics and destination recommendations
- 🌐 **Multi-language Support** - Interface and content localization for global users
- 📧 **Email Itinerary Sharing** - Send detailed travel plans to friends and travel companions
- 💰 **Budget Tracking** - Expense estimation and budget management tools
- 🎨 **Custom Themes** - Personalized color schemes and UI customizations
- 📱 **Mobile App** - Native iOS and Android applications
- 🤝 **Collaborative Planning** - Share and co-edit itineraries with travel partners
- 🎯 **Smart Recommendations** - ML-powered suggestions based on user behavior and preferences

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

If you encounter any issues or have questions, please feel free to:
- Open an issue on GitHub
- Contact the development team
- Check the documentation for troubleshooting tips

---

**Made with ❤️ for travelers who dream big and explore fearlessly**
**Created by Harshavardhan M V and Charunethra G**