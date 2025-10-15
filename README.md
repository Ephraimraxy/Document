# OnlyOffice Document Editor

A modern web application for creating and editing documents using OnlyOffice Document Server integration.

## Features

- 📝 **Word Document Editor** - Create and edit .docx files
- 📊 **Excel Spreadsheet Editor** - Create and edit .xlsx files  
- 📈 **PowerPoint Presentation Editor** - Create and edit .pptx files
- 🎨 **Modern UI** - Built with React, TypeScript, and Tailwind CSS
- ⚡ **Real-time Editing** - Powered by OnlyOffice Document Server
- 🔒 **Secure** - JWT-based authentication and secure document handling

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express, TypeScript
- **Document Server**: OnlyOffice Document Server
- **Deployment**: Netlify

## Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ephraimraxy/Document.git
   cd Document
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5000`

## Deployment to Netlify

### Automatic Deployment (Recommended)

1. **Connect to Netlify**
   - Go to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub account
   - Select the `Ephraimraxy/Document` repository

2. **Configure Build Settings**
   - Build command: `npm run build:netlify`
   - Publish directory: `dist/public`
   - Node version: `20`

3. **Deploy**
   - Click "Deploy site"
   - Netlify will automatically build and deploy your site

### Manual Deployment

1. **Build the project**
   ```bash
   npm run build:netlify
   ```

2. **Deploy to Netlify**
   ```bash
   npx netlify deploy --prod --dir=dist/public
   ```

## Environment Variables

Set these environment variables in your Netlify dashboard:

- `ONLYOFFICE_SECRET` - Secret key for JWT signing (default: provided)
- `ONLYOFFICE_SERVER` - OnlyOffice Document Server URL (default: provided)

## Project Structure

```
Document/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Page components
│   │   └── lib/           # Utilities and API client
├── server/                # Express backend
│   ├── routes.ts         # API routes
│   ├── documentTemplates.ts # Document handling
│   └── index.ts          # Server entry point
├── netlify/              # Netlify functions
│   └── functions/
│       └── server.ts     # Serverless function
├── public/               # Static assets
│   └── templates/       # Document templates
└── netlify.toml         # Netlify configuration
```

## API Endpoints

- `POST /api/doc-config` - Generate document configuration
- `GET /api/callback` - OnlyOffice callback handler
- `POST /api/callback` - OnlyOffice callback handler

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions, please open an issue on GitHub or contact the maintainers."# DocuEdit" 
