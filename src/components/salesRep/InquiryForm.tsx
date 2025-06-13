/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Edit,
  Plus,
  Save,
  Search,
  Trash2,
  X,
  Calendar,
  MapPin,
  Phone,
  Home,
  Building,
  Clock,
  DollarSign,
  FileText,
} from "lucide-react";
import { useEffect, useState } from "react";
import DeleteConfirmation from "../common/DeleteComfirmation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useInquiryStore } from "@/store/inquiry";
import {
  ICountry,
  IState,
  ICity,
  Country,
  State,
  City,
} from "country-state-city";
import { useCurrentUser } from "@/hooks/auth";
import { Inquiry, InquiryWithUser } from "@/types";

const InquiryPage = () => {
  const user = useCurrentUser();
  const {
    inquiries,
    loading,
    error,
    fetchInquiries,
    createInquiry,
    updateInquiry,
    deleteInquiry,
    clearError,
  } = useInquiryStore();

  const [selectedCountry, setSelectedCountry] = useState<ICountry | null>(null);
  const [selectedState, setSelectedState] = useState<IState | null>(null);
  const [selectedCity, setSelectedCity] = useState<ICity | null>(null);
  const [allCountries, setAllCountries] = useState<ICountry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentInquiry, setCurrentInquiry] = useState<Inquiry | null>(null);

  const [formData, setFormData] = useState<Partial<Inquiry>>({
    createdBy: user?.id,
    name: "",
    email: "",
    ContactNumber: "",
    jobType: "joineries-wood-work",
    country: "United Arab Emirates",
    state: "Dubai", // Add this line
    city: "Dubai", // Add this line
    area: "",
    propertyType: "residential",
    buildingType: "villa",
    buildingName: "",
    inspectionPropertyType: "residential",
    budgetRange: "under-10k",
    projectUrgency: "normal",
    preferredInspectionDate: undefined,
    alternativeInspectionDate: undefined,
    specialRequirements: "",
    status: "new",
    mapLocation: "",
  });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [onConfirmCallback, setOnConfirmCallback] = useState<
    (() => void) | null
  >(null);

  useEffect(() => {
    // Initialize with UAE, Dubai, Dubai
    const initializeLocation = () => {
      // Find UAE country object
      const uaeCountry = allCountries.find(
        (country) => country.name === "United Arab Emirates"
      );

      if (uaeCountry) {
        setSelectedCountry(uaeCountry);

        // Get states for UAE
        const uaeStates = State.getStatesOfCountry(uaeCountry.isoCode);
        const dubaiState = uaeStates.find((state) => state.name === "Dubai");

        if (dubaiState) {
          setSelectedState(dubaiState);

          // Get cities for Dubai state
          const dubaicities = City.getCitiesOfState(
            dubaiState.countryCode,
            dubaiState.isoCode
          );
          const dubaiCity = dubaicities.find((city) => city.name === "Dubai");

          if (dubaiCity) {
            setSelectedCity(dubaiCity);
          }
        }
      }
    };

    // Only initialize if countries are loaded and no country is selected yet
    if (allCountries.length > 0 && !selectedCountry) {
      initializeLocation();
    }
  }, [allCountries, selectedCountry]);

  // Initialize countries on component mount
  useEffect(() => {
    try {
      const countries = Country.getAllCountries();
      setAllCountries(countries || []);
    } catch (error) {
      console.error("Error loading countries:", error);
      setAllCountries([]);
    }
  }, []);

  // Get states for selected country
  const [states, setStates] = useState<IState[]>([]);
  useEffect(() => {
    if (selectedCountry) {
      try {
        const stateList = State.getStatesOfCountry(selectedCountry.isoCode);
        setStates(stateList || []);
      } catch (error) {
        console.error("Error loading states:", error);
        setStates([]);
      }
    } else {
      setStates([]);
    }
  }, [selectedCountry]);

  // Get cities for selected state
  const [cities, setCities] = useState<ICity[]>([]);
  useEffect(() => {
    if (selectedState && selectedCountry) {
      try {
        const cityList = City.getCitiesOfState(
          selectedState.countryCode,
          selectedState.isoCode
        );
        setCities(cityList || []);
      } catch (error) {
        console.error("Error loading cities:", error);
        setCities([]);
      }
    } else {
      setCities([]);
    }
  }, [selectedState, selectedCountry]);

  // Update form data when location selections change
  useEffect(() => {
    if (selectedCountry) {
      setFormData((prev) => ({ ...prev, country: selectedCountry.name }));
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedState) {
      setFormData((prev) => ({ ...prev, state: selectedState.name }));
    } else {
      setFormData((prev) => ({ ...prev, state: "" }));
    }
  }, [selectedState]);

  useEffect(() => {
    if (selectedCity) {
      setFormData((prev) => ({ ...prev, city: selectedCity.name }));
    } else {
      setFormData((prev) => ({ ...prev, city: "" }));
    }
  }, [selectedCity]);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  console.log("Inquires:", inquiries);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: Partial<Inquiry>) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name: string, date: Date | undefined) => {
    setFormData((prev) => ({ ...prev, [name]: date }));
  };

  const resetForm = () => {
    setFormData({
      createdBy: user?.id || "",
      name: "",
      email: "",
      ContactNumber: "",
      jobType: "joineries-wood-work",
      country: "United Arab Emirates",
      state: "Dubai", // Add this line
      city: "Dubai", // Add this line
      area: "",
      propertyType: "residential",
      buildingType: "villa",
      buildingName: "",
      inspectionPropertyType: "residential",
      budgetRange: "under-10k",
      projectUrgency: "normal",
      preferredInspectionDate: undefined,
      alternativeInspectionDate: undefined,
      specialRequirements: "",
      status: "new",
      mapLocation: "",
    });

    const uaeCountry = allCountries.find(
      (country) => country.name === "United Arab Emirates"
    );
    if (uaeCountry) {
      setSelectedCountry(uaeCountry);
      // You might also want to reset state and city selections here
    }
  };

  const openSidebar = (inquiry: Inquiry | null = null) => {
    if (inquiry) {
      setCurrentInquiry(inquiry);
      setFormData({
        ...inquiry,
        preferredInspectionDate: inquiry.preferredInspectionDate
          ? new Date(inquiry.preferredInspectionDate).toISOString()
          : undefined,
        alternativeInspectionDate: inquiry.alternativeInspectionDate
          ? new Date(inquiry.alternativeInspectionDate).toISOString()
          : undefined,
      });
    } else {
      setCurrentInquiry(null);
      resetForm();
    }
    setSidebarOpen(true);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
    setCurrentInquiry(null);
    resetForm();
    clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    // Required field validation
    if (!formData.name) {
      confirm("Name is required");
      return;
    }
    if (!formData.email) {
      confirm("Email is required");
      return;
    }
    if (!formData.ContactNumber) {
      confirm("Contact number is required");
      return;
    }
    if (!formData.jobType) {
      confirm("Job type is required");
      return;
    }

    try {
      if (currentInquiry?.id) {
        await updateInquiry(currentInquiry.id, formData as Inquiry);
      } else {
        await createInquiry(formData as Inquiry);
      }
      closeSidebar();
      // window.location.reload(); // Refresh the page to show updated inquiries
    } catch (err) {
      console.error("Form submission error:", err);
    }
  };

  const handleDelete = (id: string) => {
    setConfirmText(`Are you sure you want to delete this inquiry?`);
    setOnConfirmCallback(() => async () => {
      try {
        await deleteInquiry(id);
        if (currentInquiry?.id === id) {
          closeSidebar();
        }
      } catch (err) {
        console.error("Delete error:", err);
      } finally {
        setIsDeleteModalOpen(false);
      }
    });
    setIsDeleteModalOpen(true);
  };

  // const filteredInquiries = inquiries.filter(
  //   (inquiry: Inquiry) =>
  //     inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     inquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     inquiry.ContactNumber.toLowerCase().includes(searchTerm.toLowerCase())
  //     // inquiry.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     // inquiry.area?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     // inquiry.buildingName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     // inquiry.specialRequirements
  //     //   ?.toLowerCase()
  //     //   .includes(searchTerm.toLowerCase()) ||
  //     // inquiry.jobType.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     // inquiry.budgetRange?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     // inquiry.status.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  // Replace the filteredInquiries function with this fixed version:

  const filteredInquiries = inquiries.filter(
    (inquiry: Inquiry) =>
      (inquiry.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (inquiry.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (inquiry.ContactNumber?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      )
    // You can also uncomment and fix these other fields if needed:
    // (inquiry.city?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    // (inquiry.area?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    // (inquiry.buildingName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    // (inquiry.specialRequirements?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    // (inquiry.jobType?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    // (inquiry.budgetRange?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    // (inquiry.status?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const capitalizeFirstLetter = (str: string): string => {
    if (!str || typeof str !== "string") return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const formatDate = (date?: Date | string): string => {
    if (!date) return "-";
    const d = new Date(date);
    return d.toLocaleDateString();
  };

  return (
    <div className="w-full">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 mb-6 border border-emerald-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-emerald-800">
              Inquiry Management
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Manage and track customer inquiries
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search inquiries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-full"
              />
            </div>

            <Button
              onClick={() => openSidebar()}
              className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white shadow-lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Inquiry
            </Button>
          </div>
        </div>
      </div>

      {/* Inquiries Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-emerald-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-emerald-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-emerald-800 uppercase tracking-wider"
                >
                  #
                </th>

                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-emerald-800 uppercase tracking-wider"
                >
                  <div className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    Contact
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-emerald-800 uppercase tracking-wider"
                >
                  Job Type
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-emerald-800 uppercase tracking-wider hidden md:table-cell"
                >
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    Location
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-emerald-800 uppercase tracking-wider hidden lg:table-cell"
                >
                  <div className="flex items-center gap-1">Budget</div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-emerald-800 uppercase tracking-wider hidden sm:table-cell"
                >
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Inspection Date
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-emerald-800 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading && inquiries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10">
                    <div className="flex justify-center mb-2">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
                    </div>
                    <p className="text-gray-500">Loading inquiries...</p>
                  </td>
                </tr>
              ) : filteredInquiries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10">
                    <div className="flex flex-col items-center justify-center">
                      <Search className="h-10 w-10 text-gray-400 mb-2" />
                      <p className="text-gray-500">
                        {searchTerm
                          ? "No inquiries match your search"
                          : "No inquiries found"}
                      </p>
                      {!searchTerm && (
                        <Button
                          onClick={() => openSidebar()}
                          className="mt-4 bg-gradient-to-r from-emerald-600 to-blue-600"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Create New Inquiry
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredInquiries.map((inquiry: Inquiry, index: number) => (
                  <tr
                    key={inquiry.id}
                    className="hover:bg-emerald-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1 p-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">
                            {inquiry.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">
                            {inquiry.ContactNumber}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">
                            {inquiry.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="secondary" className="text-xs">
                        {capitalizeFirstLetter(
                          (inquiry.jobType || "").replace(/-/g, " ")
                        )}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {inquiry.city}, {inquiry.area}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 hidden lg:table-cell">
                      <Badge
                        variant="outline"
                        className="text-xs bg-blue-50 text-blue-700"
                      >
                        {inquiry.budgetRange || "Not specified"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {formatDate(
                            inquiry.preferredInspectionDate ?? undefined
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-100"
                          onClick={() => openSidebar(inquiry)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => handleDelete(inquiry.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right Sidebar Form */}
      <div
        className={`fixed inset-y-0 right-0 w-full md:w-[65%] lg:w-[55%] bg-white shadow-xl border-l border-gray-200 transform transition-transform duration-300 ease-in-out z-50 ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="bg-gradient-to-r from-emerald-600 to-blue-600 p-4 text-white">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">
                {currentInquiry ? "Edit Inquiry" : "New Inquiry"}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 rounded-full text-white hover:bg-white/10"
                onClick={closeSidebar}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="p-4 flex-1 overflow-y-auto">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Main form sections with better spacing */}
              <div className="space-y-8">
                {/* Contact Information */}
                <div className="bg-gray-50 p-2 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 uppercase tracking-wider flex items-center gap-2 mb-2">
                    <Phone className="h-4 w-4" />
                    Contact Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {" "}
                    {/* Changed from 2 to 3 columns */}
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Name <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name || ""}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter your name"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Email <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email || ""}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter your email"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="ContactNumber"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Contact Number <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="tel"
                        id="ContactNumber"
                        name="ContactNumber"
                        value={formData.ContactNumber || ""}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter your contact number"
                      />
                    </div>
                  </div>
                </div>

                {/* Job Details */}
                <div className="bg-gray-50 p-2 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 uppercase tracking-wider flex items-center gap-2 mb-2">
                    <Home className="h-4 w-4" />
                    Job Details
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="jobType"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Job Type <span className="text-red-500">*</span>
                      </label>
                      <Select
                        value={formData.jobType || "joineries-wood-work"}
                        onValueChange={(value) =>
                          handleSelectChange("jobType", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select job type" />
                        </SelectTrigger>
                        <SelectContent>
                          {[
                            "joineries-wood-work",
                            "painting-decorating",
                            "electrical",
                            "sanitary-plumbing-toilets-washroom",
                            "equipment-installation-maintenance",
                            "other",
                          ].map((type) => (
                            <SelectItem key={type} value={type}>
                              {capitalizeFirstLetter(type.replace(/-/g, " "))}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label
                        htmlFor="budgetRange"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Budget Range
                      </label>
                      <Select
                        value={formData.budgetRange || "under-10k"}
                        onValueChange={(value) =>
                          handleSelectChange("budgetRange", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select budget range" />
                        </SelectTrigger>
                        <SelectContent>
                          {[
                            "under-10k",
                            "10k-50k",
                            "50k-100k",
                            "100k-500k",
                            "above-500k",
                          ].map((range) => (
                            <SelectItem key={range} value={range}>
                              {capitalizeFirstLetter(range.replace(/-/g, " "))}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label
                        htmlFor="projectUrgency"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Project Urgency
                      </label>
                      <Select
                        value={formData.projectUrgency ?? "urgent"}
                        onValueChange={(value) =>
                          handleSelectChange("projectUrgency", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select urgency" />
                        </SelectTrigger>
                        <SelectContent>
                          {[
                            "urgent",
                            "normal",
                            "flexible",
                            "future-planning",
                          ].map((urgency) => (
                            <SelectItem key={urgency} value={urgency}>
                              {capitalizeFirstLetter(
                                urgency.replace(/-/g, " ")
                              )}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label
                        htmlFor="preferredInspectionDate"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Preferred Inspection Date
                      </label>
                      <input
                        type="date"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={
                          formData.preferredInspectionDate
                            ? new Date(formData.preferredInspectionDate)
                                .toISOString()
                                .split("T")[0]
                            : ""
                        }
                        onChange={(e) =>
                          handleDateChange(
                            "preferredInspectionDate",
                            e.target.value
                              ? new Date(e.target.value)
                              : undefined
                          )
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Location Information */}
                <div className="bg-gray-50 p-2 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 uppercase tracking-wider flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4" />
                    Location Information
                  </h4>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label
                          htmlFor="country"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Country
                        </label>
                        <Select
                          value={formData.country || ""}
                          onValueChange={(value) => {
                            const country = allCountries.find(
                              (c) => c.name === value
                            );
                            setSelectedCountry(country || null);
                            setSelectedState(null);
                            setSelectedCity(null);
                            handleSelectChange("country", value);
                          }}
                          disabled={loading || allCountries.length === 0}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent className="max-h-[300px] overflow-y-auto">
                            {allCountries.map((country) => (
                              <SelectItem
                                key={country.isoCode}
                                value={country.name}
                              >
                                {country.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label
                          htmlFor="state"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          State/Province
                        </label>
                        <Select
                          value={formData.state || ""}
                          onValueChange={(value) => {
                            const state = states.find((s) => s.name === value);
                            setSelectedState(state || null);
                            setSelectedCity(null);
                            handleSelectChange("state", value);
                          }}
                          disabled={
                            !selectedCountry || loading || states.length === 0
                          }
                        >
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                selectedCountry
                                  ? "Select state"
                                  : "Select country first"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent className="max-h-[300px] overflow-y-auto">
                            {states.length > 0 ? (
                              states.map((state) => (
                                <SelectItem
                                  key={state.isoCode}
                                  value={state.name}
                                >
                                  {state.name}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="-" disabled>
                                No states available
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label
                          htmlFor="city"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          City
                        </label>
                        <Select
                          value={formData.city || ""}
                          onValueChange={(value) => {
                            const city = cities.find((c) => c.name === value);
                            setSelectedCity(city || null);
                            handleSelectChange("city", value);
                          }}
                          disabled={
                            !selectedState || loading || cities.length === 0
                          }
                        >
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                selectedState
                                  ? "Select city"
                                  : "Select state first"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent className="max-h-[300px] overflow-y-auto">
                            {cities.length > 0 ? (
                              cities.map((city) => (
                                <SelectItem
                                  key={`${city.name}-${city.stateCode}`}
                                  value={city.name}
                                >
                                  {city.name}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="-" disabled>
                                No cities available
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="area"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Area/Locality
                      </label>
                      <Input
                        id="area"
                        name="area"
                        value={formData.area || ""}
                        onChange={handleInputChange}
                        placeholder="Enter area/locality"
                      />
                    </div>
                  </div>
                </div>

                {/* Property Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 uppercase tracking-wider flex items-center gap-2 mb-4">
                    <Building className="h-4 w-4" />
                    Property Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="propertyType"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Property Type
                      </label>
                      <Select
                        value={formData.propertyType ?? undefined}
                        onValueChange={(value) =>
                          handleSelectChange("propertyType", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select property type" />
                        </SelectTrigger>
                        <SelectContent>
                          {["residential", "commercial"].map((type) => (
                            <SelectItem key={type} value={type}>
                              {capitalizeFirstLetter(type)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label
                        htmlFor="buildingType"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Building Type
                      </label>
                      <Select
                        value={formData.buildingType ?? undefined}
                        onValueChange={(value) =>
                          handleSelectChange("buildingType", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select building type" />
                        </SelectTrigger>
                        <SelectContent>
                          {["villa", "apartment", "shop", "office"].map(
                            (type) => (
                              <SelectItem key={type} value={type}>
                                {capitalizeFirstLetter(type)}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label
                        htmlFor="buildingName"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Building Name
                      </label>
                      <Input
                        id="buildingName"
                        name="buildingName"
                        value={formData.buildingName || ""}
                        onChange={handleInputChange}
                        placeholder="Enter building name"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="inspectionPropertyType"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Inspection Property Type
                      </label>
                      <Select
                        value={formData.inspectionPropertyType ?? undefined}
                        onValueChange={(value) =>
                          handleSelectChange("inspectionPropertyType", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select inspection type" />
                        </SelectTrigger>
                        <SelectContent>
                          {["residential", "commercial", "industrial"].map(
                            (type) => (
                              <SelectItem key={type} value={type}>
                                {capitalizeFirstLetter(type)}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Inspection Dates */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 uppercase tracking-wider flex items-center gap-2 mb-4">
                    <Clock className="h-4 w-4" />
                    Inspection Dates
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="alternativeInspectionDate"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Alternative Inspection Date
                      </label>
                      <input
                        type="date"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={
                          formData.alternativeInspectionDate
                            ? new Date(formData.alternativeInspectionDate)
                                .toISOString()
                                .split("T")[0]
                            : ""
                        }
                        onChange={(e) =>
                          handleDateChange(
                            "alternativeInspectionDate",
                            e.target.value
                              ? new Date(e.target.value)
                              : undefined
                          )
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Special Requirements */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 uppercase tracking-wider flex items-center gap-2 mb-4">
                    <FileText className="h-4 w-4" />
                    Additional Information
                  </h4>
                  {/* <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="mapLocation"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Map Location
                      </label>
                      <Input
                        id="mapLocation"
                        name="mapLocation"
                        value={formData.mapLocation || ""}
                        onChange={handleInputChange}
                        placeholder="Enter map location URL or coordinates"
                      />
                    </div>
                  </div> */}
                  {/* Status */}
                  <div className="mt-4">
                    <label
                      htmlFor="status"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Status
                    </label>
                    <Select
                      value={formData.status || "new"}
                      onValueChange={(value) =>
                        handleSelectChange("status", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {["new", "in-progress", "completed", "cancelled"].map(
                          (status) => (
                            <SelectItem key={status} value={status}>
                              {capitalizeFirstLetter(status)}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label
                      htmlFor="specialRequirements"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Special Requirements
                    </label>
                    <Textarea
                      id="specialRequirements"
                      name="specialRequirements"
                      value={formData.specialRequirements || ""}
                      onChange={handleInputChange}
                      placeholder="Enter any special requirements"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Form Footer */}
          <div className="p-4 border-t bg-gray-50">
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={closeSidebar}
                className="border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white shadow-lg"
              >
                {loading ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    {currentInquiry ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {currentInquiry ? "Update Inquiry" : "Create Inquiry"}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40 backdrop-blur-sm"
          onClick={closeSidebar}
        />
      )}

      <DeleteConfirmation
        text={confirmText}
        onConfirm={onConfirmCallback ?? (() => {})}
        isOpen={isDeleteModalOpen}
        setIsOpen={setIsDeleteModalOpen}
      />
    </div>
  );
};

export default InquiryPage;
