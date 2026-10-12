import { Routes, Route, Navigate, useLocation, useParams } from 'react-router-dom'
import Home from '../features/home/Home'
import Sale from '../features/sale/page/Sale'
import Single_product from '../features/single product/page/Single_product'
import Offer_poster from '../hooks/offers/page/Offer_poster'
import OrderDashboard from '../features/Dasboard/page/OrderDashboard'
import About from '../features/About/page/About'
import ContactUs from '../components/Contact'

import AdminLogin from '../features/auth/page/AdminLogin'
import AdminRoute from '../features/Dasboard/page/AdminRoute'
import Invoice from '../features/Dasboard/page/InvoicePrint'
import Unauthorized from '../features/auth/page/Unauthorized'
function LegacyOrderDetailsRedirect() {
    const { id } = useParams();
    return <Navigate to={`/eehook-dashboard/orders/${id}`} replace />;
}

function LegacyDashboardPathRedirect() {
    const location = useLocation();
    const nextPath = location.pathname.replace(/^\/(?:order-dashboard|orderdashboard)/i, "/eehook-dashboard");
    return <Navigate to={`${nextPath}${location.search}${location.hash}`} replace />;
}

function LegacyFindProductsRedirect() {
    const location = useLocation();
    return <Navigate to={`/find-products${location.search}${location.hash}`} replace />;
}

function Router() {
    return (
        <div>

            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='find-products' element={<Sale />} />
                <Route path='shop' element={<LegacyFindProductsRedirect />} />
                <Route path='products' element={<LegacyFindProductsRedirect />} />
                <Route path='/about' element={<About />} />

                <Route path='profile' element={<Navigate to="/" replace />} />

                <Route path="/single/:id" element={<Single_product />} />

                <Route path="/offers" element={<Offer_poster />} />

                <Route path='myorders' element={<Navigate to="/" replace />} />

                <Route path='admin-login' element={<AdminLogin />} />
                <Route path='eehook-dashboard/admin-login' element={<AdminLogin />} />
                <Route path='unauthorized' element={<Unauthorized />} />


                <Route path="eehook-dashboard" element={
                    <AdminRoute>
                        <OrderDashboard />
                    </AdminRoute>
                } />
                <Route path="eehook-dashboard/product-variants" element={<AdminRoute><Navigate to="/eehook-dashboard/products" replace /></AdminRoute>} />
                <Route path="eehook-dashboard/product-variant-units" element={<AdminRoute><Navigate to="/eehook-dashboard/products" replace /></AdminRoute>} />
                <Route path="eehook-dashboard/product-images" element={<AdminRoute><Navigate to="/eehook-dashboard/products" replace /></AdminRoute>} />
                <Route path="eehook-dashboard/products/new" element={<AdminRoute><OrderDashboard /></AdminRoute>} />
                <Route path="eehook-dashboard/products/:id" element={<AdminRoute><OrderDashboard /></AdminRoute>} />
                <Route path="eehook-dashboard/products/:id/edit" element={<AdminRoute><OrderDashboard /></AdminRoute>} />
                <Route path="eehook-dashboard/hero-banners/new" element={<AdminRoute><OrderDashboard /></AdminRoute>} />
                <Route path="eehook-dashboard/hero-banners/:id/edit" element={<AdminRoute><OrderDashboard /></AdminRoute>} />
                <Route path="eehook-dashboard/promo-banners/new" element={<AdminRoute><OrderDashboard /></AdminRoute>} />
                <Route path="eehook-dashboard/promo-banners/:id/edit" element={<AdminRoute><OrderDashboard /></AdminRoute>} />
                <Route path="eehook-dashboard/hero-side-banners/new" element={<AdminRoute><OrderDashboard /></AdminRoute>} />
                <Route path="eehook-dashboard/hero-side-banners/:id/edit" element={<AdminRoute><OrderDashboard /></AdminRoute>} />
                <Route path="eehook-dashboard/coupons/new" element={<AdminRoute><OrderDashboard /></AdminRoute>} />
                <Route path="eehook-dashboard/coupons/:id/edit" element={<AdminRoute><OrderDashboard /></AdminRoute>} />
                <Route path="eehook-dashboard/trust-benefits/new" element={<AdminRoute><OrderDashboard /></AdminRoute>} />
                <Route path="eehook-dashboard/welcome-bonuses/new" element={<AdminRoute><OrderDashboard /></AdminRoute>} />
                <Route path="eehook-dashboard/welcome-bonuses/:id/edit" element={<AdminRoute><OrderDashboard /></AdminRoute>} />
                <Route path="eehook-dashboard/coupon-usages/new" element={<AdminRoute><OrderDashboard /></AdminRoute>} />
                <Route path="eehook-dashboard/coupon-usages/:id/edit" element={<AdminRoute><OrderDashboard /></AdminRoute>} />
                <Route path="eehook-dashboard/token-blacklist" element={<AdminRoute><Navigate to="/eehook-dashboard/token-blacklist/outstanding-tokens" replace /></AdminRoute>} />
                <Route path="eehook-dashboard/token-blacklist/outstanding-tokens" element={<AdminRoute><OrderDashboard /></AdminRoute>} />
                <Route path="eehook-dashboard/token-blacklist/blacklisted-tokens" element={<AdminRoute><OrderDashboard /></AdminRoute>} />
                <Route path="eehook-dashboard/:section" element={
                    <AdminRoute>
                        <OrderDashboard />
                    </AdminRoute>
                } />
                <Route path="eehook-dashboard/orders/:id" element={<AdminRoute><OrderDashboard /></AdminRoute>} />
                <Route path="eehook-dashboard/:section/:id/view" element={<AdminRoute><OrderDashboard /></AdminRoute>} />
                <Route path="eehook-dashboard/:section/:id/edit" element={<AdminRoute><OrderDashboard /></AdminRoute>} />
                <Route
                    path="/eehook-dashboard/details/:id"
                    element={
                        <AdminRoute>
                            <LegacyOrderDetailsRedirect />
                        </AdminRoute>
                    }
                />
                <Route
                    path="/eehook-dashboard/invoice/:id"
                    element={
                        <AdminRoute>
                            <Invoice />
                        </AdminRoute>
                    }
                />
                <Route path="order-dashboard" element={<LegacyDashboardPathRedirect />} />
                <Route path="order-dashboard/*" element={<LegacyDashboardPathRedirect />} />
                <Route path="orderDashboard" element={<LegacyDashboardPathRedirect />} />
                <Route path="orderDashboard/*" element={<LegacyDashboardPathRedirect />} />
                <Route path='contact' element={<ContactUs />} />

            </Routes>

        </div>
    )
}

export default Router
