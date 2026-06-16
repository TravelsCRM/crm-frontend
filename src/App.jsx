import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard/Dashboard';
import QueriesList from './pages/Queries/QueriesList';
import CreateQuery from './pages/Queries/CreateQuery';
import QueryDetails from './pages/Queries/QueryDetails';
import ItineraryList from './pages/Itineraries/ItineraryList';
import ItineraryBuilder from './pages/Itineraries/ItineraryBuilder';
import QuotationBuilder from './pages/Quotations/QuotationBuilder';
import Login from './pages/Auth/Login';
import ProtectedRoute from './components/ProtectedRoute';

import ClientList from './pages/Clients/ClientList';
import CreateClient from './pages/Clients/CreateClient';
import ClientDetails from './pages/Clients/ClientDetails';
import AgentList from './pages/Agents/AgentList';
import CorporateList from './pages/Corporates/CorporateList';
import SupplierList from './pages/Masters/SupplierList';
import CreateSupplier from './pages/Masters/CreateSupplier';
import HotelList from './pages/Masters/HotelList';
import CreateHotel from './pages/Masters/CreateHotel';
import DestinationList from './pages/Masters/DestinationList';
import CreateDestination from './pages/Masters/CreateDestination';
import ActivityList from './pages/Masters/ActivityList';
import CreateActivity from './pages/Masters/CreateActivity';

import BookingList from './pages/Bookings/BookingList';
import BookingDetails from './pages/Bookings/BookingDetails';
import PaymentList from './pages/Accounts/PaymentList';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="queries" element={<QueriesList />} />
          <Route path="queries/new" element={<CreateQuery />} />
          <Route path="queries/:id" element={<QueryDetails />} />
          <Route path="itineraries" element={<ItineraryList />} />
          <Route path="itineraries/new" element={<ItineraryBuilder />} />
          <Route path="itineraries/:id/edit" element={<ItineraryBuilder />} />
          <Route path="quotations/new" element={<QuotationBuilder />} />
          
          <Route path="bookings" element={<BookingList />} />
          <Route path="bookings/:id" element={<BookingDetails />} />

          <Route path="accounts">
             <Route path="payments" element={<PaymentList />} />
          </Route>

          <Route path="clients" element={<ClientList />} />
          <Route path="clients/new" element={<CreateClient />} />
          <Route path="clients/:id" element={<ClientDetails />} />
          <Route path="agents" element={<AgentList />} />
          <Route path="agents/new" element={<div className="p-4">Add Agent Page</div>} />
          <Route path="corporates" element={<CorporateList />} />
          <Route path="corporates/new" element={<div className="p-4">Add Corporate Page</div>} />
          <Route path="masters">
            <Route path="suppliers" element={<SupplierList />} />
            <Route path="suppliers/new" element={<CreateSupplier />} />
            <Route path="hotels" element={<HotelList />} />
            <Route path="hotels/new" element={<CreateHotel />} />
            <Route path="destinations" element={<DestinationList />} />
            <Route path="destinations/new" element={<CreateDestination />} />
            <Route path="activities" element={<ActivityList />} />
            <Route path="activities/new" element={<CreateActivity />} />
          </Route>
          <Route path="settings" element={<div className="p-4">Settings Page</div>} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;