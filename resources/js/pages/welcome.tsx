import { Navbar } from '@/components/ui/navbar';
import { Head } from '@inertiajs/react';
import { BarChart3, CheckCircle, ChevronRight, DollarSign, Package, Shield, Target, TrendingUp, UserPlus, Users, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Welcome() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);
    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="min-h-screen bg-white dark:bg-gray-900">
                <Navbar />

                <section className="relative bg-gradient-to-br from-blue-50 via-white to-blue-50 py-20 dark:from-gray-800 dark:via-gray-900 dark:to-blue-900">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div
                            className={`text-center transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                        >
                            <div className="mb-6 inline-flex items-center rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                <Target className="mr-2 h-4 w-4" />
                                Digital Transformation Initiative
                            </div>
                            <h1 className="mb-6 text-4xl leading-tight font-bold text-gray-900 md:text-6xl dark:text-white">
                                Transformasi Digital untuk
                                <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-green-400">
                                    {' '}
                                    Smart ISP
                                </span>
                            </h1>
                            <p className="mx-auto mb-8 max-w-3xl text-xl leading-relaxed text-gray-600 dark:text-gray-300">
                                Revolusionisasi proses sales dengan sistem CRM terintegrasi. Dari pencatatan manual menuju otomatisasi cerdas untuk
                                manajemen lead, pelanggan, dan transaksi.
                            </p>
                            <div className="flex flex-col justify-center gap-4 sm:flex-row">
                                <button className="inline-flex transform items-center rounded-lg bg-blue-600 px-8 py-4 font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
                                    Mulai Transformasi
                                    <ChevronRight className="ml-2 h-5 w-5" />
                                </button>
                                <button className="inline-flex items-center rounded-lg border border-gray-300 px-8 py-4 font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800">
                                    Pelajari Lebih Lanjut
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="bg-white py-20 dark:bg-gray-900">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="items-center lg:grid lg:grid-cols-2 lg:gap-16">
                            <div>
                                <div className="mb-6 inline-flex items-center rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Solusi CRM Terintegrasi
                                </div>
                                <h2 className="mb-6 text-3xl font-bold text-gray-900 md:text-4xl dark:text-white">
                                    Sistem CRM untuk Tim Sales & Manajer
                                </h2>
                                <p className="mb-6 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                                    Aplikasi Customer Relationship Management yang dirancang khusus untuk Smart ISP, mendigitalisasi seluruh proses
                                    sales dari lead generation hingga closing transaksi.
                                </p>
                                <div className="space-y-4">
                                    {[
                                        'Manajemen lead dan prospek otomatis',
                                        'Database pelanggan terpusat',
                                        'Katalog produk dan layanan digital',
                                        'Tracking transaksi real-time',
                                        'Dashboard analitik performa sales',
                                    ].map((feature, index) => (
                                        <div key={index} className="flex items-center">
                                            <CheckCircle className="mr-3 h-5 w-5 text-green-500 dark:text-green-400" />
                                            <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="mt-10 lg:mt-0">
                                <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-green-50 p-8 dark:from-gray-800 dark:to-gray-700">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="rounded-lg bg-white p-4 shadow-md dark:bg-gray-600">
                                            <UserPlus className="mb-2 h-8 w-8 text-blue-600 dark:text-blue-400" />
                                            <h4 className="font-semibold text-gray-900 dark:text-white">Lead Management</h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-300">Kelola prospek dengan sistematis</p>
                                        </div>
                                        <div className="rounded-lg bg-white p-4 shadow-md dark:bg-gray-600">
                                            <Users className="mb-2 h-8 w-8 text-green-600 dark:text-green-400" />
                                            <h4 className="font-semibold text-gray-900 dark:text-white">Customer Data</h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-300">Database pelanggan terpusat</p>
                                        </div>
                                        <div className="rounded-lg bg-white p-4 shadow-md dark:bg-gray-600">
                                            <Package className="mb-2 h-8 w-8 text-orange-600 dark:text-orange-400" />
                                            <h4 className="font-semibold text-gray-900 dark:text-white">Product Catalog</h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-300">Manajemen layanan ISP</p>
                                        </div>
                                        <div className="rounded-lg bg-white p-4 shadow-md dark:bg-gray-600">
                                            <DollarSign className="mb-2 h-8 w-8 text-purple-600 dark:text-purple-400" />
                                            <h4 className="font-semibold text-gray-900 dark:text-white">Sales Tracking</h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-300">Monitor performa penjualan</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="features" className="bg-gray-50 py-20 dark:bg-gray-800">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-16 text-center">
                            <h2 className="mb-6 text-3xl font-bold text-gray-900 md:text-4xl dark:text-white">Fitur Unggulan CRM Smart ISP</h2>
                            <p className="mx-auto max-w-2xl text-xl text-gray-600 dark:text-gray-300">
                                Solusi lengkap untuk mengatasi semua tantangan proses sales manual
                            </p>
                        </div>
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {[
                                {
                                    icon: UserPlus,
                                    title: 'Lead Management',
                                    description: 'Kelola dan tracking calon customer dengan sistem yang terorganisir dan automated follow-up',
                                    color: 'from-blue-500 to-blue-600',
                                },
                                {
                                    icon: Users,
                                    title: 'Customer Database',
                                    description: 'Database pelanggan terpusat dengan riwayat lengkap interaksi dan transaksi',
                                    color: 'from-green-500 to-green-600',
                                },
                                {
                                    icon: Package,
                                    title: 'Product Management',
                                    description: 'Katalog produk layanan ISP digital dengan pricing dan spesifikasi lengkap',
                                    color: 'from-orange-500 to-orange-600',
                                },
                                {
                                    icon: DollarSign,
                                    title: 'Sales Transaction',
                                    description: 'Sistem pencatatan transaksi otomatis dengan invoice dan reporting',
                                    color: 'from-purple-500 to-purple-600',
                                },
                                {
                                    icon: BarChart3,
                                    title: 'Analytics Dashboard',
                                    description: 'Insights real-time untuk performa sales, conversion rate, dan revenue tracking',
                                    color: 'from-teal-500 to-teal-600',
                                },
                                {
                                    icon: Shield,
                                    title: 'Data Security',
                                    description: 'Keamanan data pelanggan dengan enkripsi dan backup otomatis',
                                    color: 'from-indigo-500 to-indigo-600',
                                },
                            ].map((feature, index) => (
                                <div
                                    key={index}
                                    className="group rounded-xl bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl dark:bg-gray-700"
                                >
                                    <div
                                        className={`h-12 w-12 bg-gradient-to-r ${feature.color} mb-4 flex items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110`}
                                    >
                                        <feature.icon className="h-6 w-6 text-white" />
                                    </div>
                                    <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">{feature.title}</h3>
                                    <p className="leading-relaxed text-gray-600 dark:text-gray-300">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="benefits" className="bg-white py-20 dark:bg-gray-900">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-16 text-center">
                            <h2 className="mb-6 text-3xl font-bold text-gray-900 md:text-4xl dark:text-white">Manfaat untuk Tim dan Organisasi</h2>
                            <p className="mx-auto max-w-2xl text-xl text-gray-600 dark:text-gray-300">
                                Dampak positif implementasi CRM untuk berbagai stakeholder di Smart ISP
                            </p>
                        </div>

                        <div className="grid gap-12 lg:grid-cols-2">
                            {/* Sales Team Benefits */}
                            <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 p-8 dark:from-blue-900 dark:to-blue-800">
                                <div className="mb-6 flex items-center">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 dark:bg-blue-500">
                                        <Users className="h-6 w-6 text-white" />
                                    </div>
                                    <h3 className="ml-4 text-2xl font-bold text-gray-900 dark:text-white">Untuk Tim Sales</h3>
                                </div>
                                <ul className="space-y-4">
                                    {[
                                        'Akses data lead dan customer dari mana saja',
                                        'Automated reminder untuk follow-up',
                                        'Tracking progress deal secara real-time',
                                        'Template proposal dan quotation otomatis',
                                        'Mobile-friendly untuk sales lapangan',
                                    ].map((benefit, index) => (
                                        <li key={index} className="flex items-start">
                                            <CheckCircle className="mt-0.5 mr-3 h-5 w-5 text-green-500 dark:text-green-400" />
                                            <span className="text-gray-700 dark:text-gray-200">{benefit}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Manager Benefits */}
                            <div className="rounded-2xl bg-gradient-to-br from-green-50 to-green-100 p-8 dark:from-green-900 dark:to-green-800">
                                <div className="mb-6 flex items-center">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-600 dark:bg-green-500">
                                        <TrendingUp className="h-6 w-6 text-white" />
                                    </div>
                                    <h3 className="ml-4 text-2xl font-bold text-gray-900 dark:text-white">Untuk Manajer</h3>
                                </div>
                                <ul className="space-y-4">
                                    {[
                                        'Dashboard analitik performa tim sales',
                                        'Forecast revenue dan target achievement',
                                        'Monitoring pipeline dan conversion rate',
                                        'Report otomatis untuk stakeholder',
                                        'Data-driven decision making',
                                    ].map((benefit, index) => (
                                        <li key={index} className="flex items-start">
                                            <CheckCircle className="mt-0.5 mr-3 h-5 w-5 text-green-500 dark:text-green-400" />
                                            <span className="text-gray-700 dark:text-gray-200">{benefit}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                <footer className="bg-gray-900 py-12 dark:bg-gray-800">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid gap-8 md:grid-cols-3">
                            <div>
                                <div className="mb-4 flex items-center">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-500 dark:to-blue-700">
                                        <Zap className="h-5 w-5 text-white" />
                                    </div>
                                    <span className="ml-3 text-lg font-bold text-white">Smart ISP</span>
                                </div>
                                <p className="text-gray-400 dark:text-gray-300">
                                    Memimpin transformasi digital untuk layanan internet terdepan di Indonesia.
                                </p>
                            </div>
                            <div>
                                <h4 className="mb-4 font-semibold text-white">Solusi</h4>
                                <ul className="space-y-2 text-gray-400 dark:text-gray-300">
                                    <li>Customer Relationship Management</li>
                                    <li>Sales Process Automation</li>
                                    <li>Data Analytics & Reporting</li>
                                    <li>Digital Transformation</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="mb-4 font-semibold text-white">Kontak</h4>
                                <ul className="space-y-2 text-gray-400 dark:text-gray-300">
                                    <li>Email: it-apps@smartisp.co.id</li>
                                    <li>Phone: +62 21 1234 5678</li>
                                    <li>Address: Jakarta, Indonesia</li>
                                </ul>
                            </div>
                        </div>
                        <div className="mt-8 border-t border-gray-800 pt-8 text-center dark:border-gray-700">
                            <p className="text-gray-400 dark:text-gray-300">
                                © 2025 Smart ISP. All rights reserved. | Digital Transformation Initiative
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
