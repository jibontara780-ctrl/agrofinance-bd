const fs = require('fs');
const path = require('path');
const babel = require('@babel/standalone');

const parts = [
  '01_head_app.jsx',
  '02_landing_dashboard.jsx',
  '03_projects_portfolio_market_impact.jsx',
  '04_profile_kyc.jsx',
  '05_admin_view.jsx',
  '06_modals.jsx'
];

let fullRawContent = '';

for (const part of parts) {
  const filePath = path.join(__dirname, part);
  if (!fs.existsSync(filePath)) {
    console.error(`Missing part: ${part}`);
    process.exit(1);
  }
  const content = fs.readFileSync(filePath, 'utf8');
  fullRawContent += content + '\n\n';
}

// Split HTML shell from application JavaScript/JSX
const scriptTag = '<script id="agro-app-root">';
const scriptOpenIdx = fullRawContent.indexOf(scriptTag);
if (scriptOpenIdx === -1) {
  console.error('Could not find ' + scriptTag + ' in client parts!');
  process.exit(1);
}

const htmlHead = fullRawContent.slice(0, scriptOpenIdx);
const jsxCodePart = fullRawContent.slice(scriptOpenIdx + scriptTag.length);

const mountCode = `
    // Error Boundary Component
    class ErrorBoundary extends React.Component {
      constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
      }

      static getDerivedStateFromError(error) {
        return { hasError: true, error };
      }

      componentDidCatch(error, errorInfo) {
        console.error('AgroFinance ErrorBoundary caught:', error, errorInfo);
        window.__last_error = { error: error.message, stack: error.stack };
      }

      render() {
        if (this.state.hasError) {
          return (
            <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
              <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 text-center shadow-2xl">
                <div className="w-16 h-16 rounded-2xl bg-rose-500/20 text-rose-400 text-3xl flex items-center justify-center mx-auto border border-rose-500/30">
                  ⚠️
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-black text-white">Platform System Notice</h2>
                  <p className="text-xs text-slate-400 font-mono">
                    {this.state.error?.message || 'A transient rendering error occurred.'}
                  </p>
                </div>
                <div className="flex gap-3 justify-center pt-2">
                  <button
                    onClick={() => {
                      window.location.hash = '';
                      window.location.reload();
                    }}
                    className="px-5 py-2.5 rounded-xl gradient-agro text-white font-bold text-xs shadow hover:brightness-110 transition"
                  >
                    🔄 Refresh Page
                  </button>
                  <button
                    onClick={() => {
                      localStorage.removeItem('agro_token');
                      window.location.href = '/';
                    }}
                    className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700 transition"
                  >
                    🧹 Reset & Return Home
                  </button>
                </div>
              </div>
            </div>
          );
        }
        return this.props.children;
      }
    }

    // Mount Application with ErrorBoundary
    try {
      const root = ReactDOM.createRoot(document.getElementById('root'));
      root.render(React.createElement(ErrorBoundary, null, React.createElement(App, null)));
      console.log('✅ AgroFinance BD React App successfully mounted with ErrorBoundary!');
    } catch (mountErr) {
      console.error('Fatal mounting error:', mountErr);
      document.getElementById('root').innerHTML = '<div style=\"padding:40px;text-align:center;font-family:sans-serif;\"><h2>Platform Initialization Notice</h2><p>' + mountErr.message + '</p></div>';
    }
`;

const completeJsx = jsxCodePart + '\n' + mountCode;

console.log('🔄 Compiling JSX to vanilla React JavaScript using runtime: classic...');
let transpiledCode;
try {
  const result = babel.transform(completeJsx, {
    presets: [['react', { runtime: 'classic' }]]
  });
  transpiledCode = result.code;
  console.log(`✅ JSX compilation PASSED: Generated ${transpiledCode.length} bytes of pure vanilla JS.`);
} catch (err) {
  console.error('❌ JSX Compilation FAILED:');
  console.error(err.message);
  if (err.loc) {
    console.error(`At line ${err.loc.line}, column ${err.loc.column}`);
  }
  process.exit(1);
}

const finalHtml = `${htmlHead}<script id="agro-app-root">\n${transpiledCode}\n</script>\n</body>\n</html>\n`;

const targetPath = path.join(__dirname, '..', 'client', 'index.html');
fs.writeFileSync(targetPath, finalHtml, 'utf8');
console.log(`✅ Assembled & compiled successfully into ${targetPath} (${finalHtml.length} bytes)!`);
