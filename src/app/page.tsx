'use client';
import {
  ArrowRight,
  Award,
  Building,
  CheckCircle,
  LogIn,
  Mail,
  Menu,
  Phone,
  Settings,
  Shield,
  TrendingUp,
  Users,
  X,
  Zap
} from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

export default function EITSERPHomepage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const services = [
    {
      icon: Zap,
      title: "Electrical Systems",
      description: "Complete electrical installation and maintenance services for residential and commercial projects."
    },
    {
      icon: Building,
      title: "MEP Solutions", 
      description: "Mechanical, Electrical & Plumbing solutions designed for modern infrastructure needs."
    },
    {
      icon: Settings,
      title: "Maintenance Services",
      description: "Ongoing maintenance and support services to keep your systems running efficiently."
    },
    {
      icon: Shield,
      title: "Safety & Compliance",
      description: "Ensuring all installations meet safety standards and regulatory compliance requirements."
    }
  ];

  const features = [
    {
      icon: Users,
      title: "Complete Business Management",
      description: "From lead generation to project completion - manage your entire business cycle"
    },
    {
      icon: TrendingUp,
      title: "Real-time Analytics",
      description: "Track performance, monitor progress, and make data-driven decisions"
    },
    {
      icon: CheckCircle,
      title: "Quality Assurance",
      description: "Built-in quality control processes ensure consistent service delivery"
    },
    {
      icon: Award,
      title: "Professional Excellence",
      description: "Streamlined workflows designed for technical service excellence"
    }
  ];

  const roles = [
    { name: "Sales Representative", description: "Lead generation & customer relations", users: "12 users" },
    { name: "Sales Coordinator", description: "Enquiry processing & coordination", users: "3 users" },
    { name: "Technical Inspector", description: "Site assessment & technical analysis", users: "8 users" },
    { name: "Project Manager", description: "End-to-end project execution", users: "5 users" },
    { name: "Sales Manager", description: "Sales oversight & quotation approval", users: "2 users" },
    { name: "Operations Manager", description: "Overall operational management", users: "1 user" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              {/* Logo Space */}
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <Image src="/picture1.jpg" alt="EITS Logo" className=" object-cover" width={96} height={96} />
              </div>
              <div>
                <h1 className="text-2xl font-bold">EITS</h1>
                <p className="text-emerald-100 text-sm">Engineering & Technical Solutions</p>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#services" className="hover:text-emerald-200 transition-colors">Services</a>
              <a href="#about" className="hover:text-emerald-200 transition-colors">About</a>
              <a href="#contact" className="hover:text-emerald-200 transition-colors">Contact</a>
              <button className="flex items-center space-x-2 bg-white bg-opacity-20 px-4 py-2 rounded-lg hover:bg-opacity-30 transition-colors">
                <LogIn className="w-4 h-4" />
                <span>Staff Login</span>
              </button>
            </nav>

            {/* Mobile menu button */}
            <button 
              className="md:hidden p-2 rounded-lg hover:bg-white hover:bg-opacity-20"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-white border-opacity-20">
              <div className="flex flex-col space-y-4">
                <a href="#services" className="hover:text-emerald-200 transition-colors">Services</a>
                <a href="#about" className="hover:text-emerald-200 transition-colors">About</a>
                <a href="#contact" className="hover:text-emerald-200 transition-colors">Contact</a>
                <button className="flex items-center space-x-2 bg-white bg-opacity-20 px-4 py-2 rounded-lg hover:bg-opacity-30 transition-colors w-fit">
                  <LogIn className="w-4 h-4" />
                  <span>Staff Login</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Engineering Excellence in
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-blue-500"> Every Project</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              From initial consultation to project completion, we deliver comprehensive MEP solutions 
              that power modern infrastructure with precision and reliability.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-8 py-4 rounded-lg font-semibold hover:from-emerald-600 hover:to-blue-600 transition-all transform hover:scale-105 shadow-lg">
                Get Quote Today
              </button>
              <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold hover:border-emerald-500 hover:text-emerald-600 transition-colors">
                View Our Projects
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive engineering solutions tailored to meet your project requirements
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div key={index} className="text-center p-6 rounded-xl hover:shadow-lg transition-all duration-300 hover:transform hover:scale-105 border border-gray-100">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <service.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ERP System Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Powered by Advanced ERP</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our integrated business management system ensures seamless operations from lead to completion
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Business Process Flow */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Process</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A streamlined approach that ensures quality delivery at every stage
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between space-y-8 md:space-y-0">
            {[
              { step: "1", title: "Lead Generation", desc: "Initial contact & requirements" },
              { step: "2", title: "Site Assessment", desc: "Technical evaluation & analysis" },
              { step: "3", title: "Quotation", desc: "Detailed proposal & pricing" },
              { step: "4", title: "Project Execution", desc: "Implementation & delivery" },
              { step: "5", title: "Completion", desc: "Handover & ongoing support" }
            ].map((process, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
                  {process.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{process.title}</h3>
                <p className="text-gray-600 text-sm">{process.desc}</p>
                {index < 4 && (
                  <ArrowRight className="w-6 h-6 text-emerald-500 mt-4 md:hidden" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Staff Access Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-500 to-blue-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Staff Access</h2>
            <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
              Role-based access to our comprehensive ERP system
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roles.map((role, index) => (
              <div key={index} className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 hover:bg-opacity-20 transition-all cursor-pointer">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-white">{role.name}</h3>
                  <span className="text-sm text-emerald-100">{role.users}</span>
                </div>
                <p className="text-emerald-100 text-sm mb-4">{role.description}</p>
                <button className="flex items-center space-x-2 text-white hover:text-emerald-200 transition-colors">
                  <span className="text-sm">Access Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">Get In Touch</h2>
              <p className="text-gray-300 mb-8">
                Ready to start your next project? Contact us today for a consultation.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Phone className="w-6 h-6 text-emerald-400" />
                  <span>+91 (XXX) XXX-XXXX</span>
                </div>
                <div className="flex items-center space-x-4">
                  <Mail className="w-6 h-6 text-emerald-400" />
                  <span>info@eits.com</span>
                </div>
                <div className="flex items-center space-x-4">
                  <Building className="w-6 h-6 text-emerald-400" />
                  <span>Your Business Address Here</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800 p-8 rounded-lg">
              <h3 className="text-xl font-semibold mb-6">Send us a message</h3>
              <form className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Your Name" 
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-emerald-500 focus:outline-none"
                />
                <input 
                  type="email" 
                  placeholder="Your Email" 
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-emerald-500 focus:outline-none"
                />
                <textarea 
                  placeholder="Your Message" 
                  rows={4}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-emerald-500 focus:outline-none"
                ></textarea>
                <button className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-3 rounded-lg font-semibold hover:from-emerald-600 hover:to-blue-600 transition-colors">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-lg font-bold">E</span>
              </div>
              <span className="text-lg font-semibold">EITS</span>
            </div>
            <p className="text-gray-400 text-sm">
              © 2025 EITS. All rights reserved. Engineering excellence in every project.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}