import React from 'react';
import { Layers, Store } from 'lucide-react';
import { StoreProvider, useStore } from './context/StoreContext';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Header } from './components/Header';
import { CartDrawer } from './components/CartDrawer';
import { Footer } from './components/Footer';
import { LiveChatWidget } from './components/LiveChatWidget';
import { HomePage } from './pages/HomePage';
import { CollectionPage } from './pages/CollectionPage';
import { ProductPage } from './pages/ProductPage';
import { PlannerPage } from './pages/PlannerPage';
import { ShowroomsPage } from './pages/ShowroomsPage';
import { DesignerDetailPage, DesignersPage } from './pages/DesignersPage';
import { FabricSamplesPage, GenericInfoPage } from './pages/InfoPages';
import { AccountPage, CartPage, SearchPage } from './pages/UtilityPages';
import {
  BespokePage,
  ProjectsPage,
  ServicesPage,
  SignUpPage,
  VideoLandingPage,
} from './pages/OkartPages';
import { UiShowcasePage } from './pages/UiShowcasePage';

function RouterView() {
  const { currentPath, toastMessage } = useStore();
  const [showcaseOpen, setShowcaseOpen] = React.useState(false);
  const [pathname, searchStr] = currentPath.split('?');
  const params = new URLSearchParams(searchStr || '');
  const cleanPath = pathname.replace(/\/+$/, '') || '/';

  const renderRoute = () => {
    if (cleanPath === '/') {
      return <HomePage />;
    }
    if (cleanPath === '/products') {
      return <CollectionPage handle="all-furniture" />;
    }
    if (cleanPath.startsWith('/collections/')) {
      const handle = cleanPath.replace('/collections/', '');
      return <CollectionPage handle={handle} />;
    }
    if (cleanPath.startsWith('/products/')) {
      const handle = cleanPath.replace('/products/', '');
      return <ProductPage key={handle} handle={handle} />;
    }
    if (cleanPath.startsWith('/blogs/designers/')) {
      const slug = cleanPath.replace('/blogs/designers/', '');
      return <DesignerDetailPage slug={slug} />;
    }
    if (cleanPath === '/signup') {
      return <SignUpPage />;
    }
    if (cleanPath === '/pages/services') {
      return <ServicesPage />;
    }
    if (cleanPath === '/pages/projects') {
      return <ProjectsPage />;
    }
    if (cleanPath === '/pages/video') {
      return <VideoLandingPage />;
    }
    if (cleanPath === '/pages/bespoke') {
      return <BespokePage />;
    }
    if (cleanPath === '/pages/planner') {
      return <PlannerPage />;
    }
    if (cleanPath === '/pages/showrooms') {
      return <ShowroomsPage initialCity={params.get('city') || undefined} />;
    }
    if (cleanPath === '/pages/designers') {
      return <DesignersPage />;
    }
    if (
      cleanPath === '/pages/fabric-types-and-colors' ||
      cleanPath === '/pages/stoftyper-og-farver'
    ) {
      return <FabricSamplesPage />;
    }
    if (cleanPath.startsWith('/pages/')) {
      const slug = cleanPath.replace('/pages/', '');
      return <GenericInfoPage slug={slug} />;
    }
    if (cleanPath === '/search') {
      return <SearchPage initialQuery={params.get('q') || ''} />;
    }
    if (cleanPath === '/cart') {
      return <CartPage />;
    }
    if (cleanPath === '/account') {
      return <AccountPage />;
    }
    return <HomePage />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F5F3] text-[#1C1C1C]">
      {/* Top-Right Corner Toggle for Interactive UI Component Showcase */}
      <button
        type="button"
        onClick={() => {
          setShowcaseOpen((prev) => !prev);
          window.scrollTo(0, 0);
        }}
        aria-pressed={showcaseOpen}
        aria-label={showcaseOpen ? 'Switch back to storefront' : 'Open UI Component Showcase'}
        className={`fixed top-1 right-2.5 sm:right-4 z-[65] h-7 px-3 rounded-full border text-[10px] uppercase tracking-[0.12em] flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer ${
          showcaseOpen
            ? 'bg-[#EDE5D5] text-[#2B1E12] border-[#B9A78B] hover:bg-[#DFD2BC]'
            : 'bg-white/95 text-[#2B1E12] border-[#B9A78B] hover:bg-[#DFD2BC]'
        }`}
      >
        {showcaseOpen ? (
          <>
            <Store className="w-3 h-3" />
            <span className="hidden sm:inline">Live Storefront</span>
            <span className="sm:hidden">Store</span>
          </>
        ) : (
          <>
            <Layers className="w-3 h-3 text-[#82674F]" />
            <span className="hidden sm:inline">UI Showcase</span>
            <span className="sm:hidden">UI Kit</span>
          </>
        )}
      </button>

      {showcaseOpen ? (
        <>
          <div className="sticky top-0 z-[60] w-full h-9 bg-[#2B1E12] text-[#EDE5D5] border-b border-[#4F3926] px-4 flex items-center">
            <span className="text-[10px] uppercase tracking-[0.16em] text-[#EDE5D5]/85 truncate pr-32">
              OKART Interiors · UI Component Showcase &amp; Figma Spec
            </span>
          </div>
          <main className="flex-1">
            <UiShowcasePage onExitShowcase={() => setShowcaseOpen(false)} />
          </main>
          <CartDrawer />
        </>
      ) : (
        <>
          <AnnouncementBar />
          <Header />
          <main className="flex-1">{renderRoute()}</main>
          <Footer />
          <CartDrawer />
          <LiveChatWidget />
        </>
      )}

      {toastMessage && (
        <div
          role="status"
          className="fixed bottom-20 right-5 z-50 px-5 py-3 bg-[#2B1E12] text-white text-[12px] tracking-[0.06em] shadow-lg border border-[#4F3926]"
        >
          {toastMessage}
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <RouterView />
    </StoreProvider>
  );
}
