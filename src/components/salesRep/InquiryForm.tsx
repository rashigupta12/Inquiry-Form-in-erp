/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Plus, Save, Search, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import DeleteConfirmation from "../common/DeleteComfirmation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { DatePicker } from "@/components/ui/date-picker";
// import { useInquiryStore } from "@/stores/useInquiryStore";
import {
  Inquiry,
  JobType,
  PropertyType,
  BuildingType,
  InspectionPropertyType,
  BudgetRange,
  ProjectUrgency,
} from "@/types";
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

  // Get all countries with error handling
  const [allCountries, setAllCountries] = useState<ICountry[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentInquiry, setCurrentInquiry] = useState<Inquiry | null>(null);

  const [formData, setFormData] = useState<Partial<Inquiry>>({
    createdBy: user?.id, // Assuming createdBy is set elsewhere
    whatsApp: "",
    jobType: "other",
    country: "India",
    state: "Delhi",
    city: "",
    area: "",
    propertyType: "residential",
    buildingType: "villa",
    buildingName: "",
    inspectionPropertyType: "residential",
    budgetRange: "under-10k",
    projectUrgency: "normal",
    preferredInspectionDate: undefined,
    alternativeInspectionDate: undefined,
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [onConfirmCallback, setOnConfirmCallback] = useState<
    (() => void) | null
  >(null);

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

  // Get states for selected country with error handling
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

  // Get cities for selected state with error handling
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

  useEffect(() => {
    if (selectedCountry) {
      setFormData((prev) => ({
        ...prev,
        country: selectedCountry.name,
      }));
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedState) {
      setFormData((prev) => ({
        ...prev,
        state: selectedState.name,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        state: "",
      }));
    }
  }, [selectedState]);

  useEffect(() => {
    if (selectedCity) {
      setFormData((prev) => ({
        ...prev,
        city: selectedCity.name,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        city: "",
      }));
    }
  }, [selectedCity]);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      whatsApp: "",
      jobType: "other",
      city: "",
      area: "",
      propertyType: "residential",
      buildingType: "villa",
      buildingName: "",
      inspectionPropertyType: "residential",
      budgetRange: "under-10k",
      projectUrgency: "normal",
      preferredInspectionDate: undefined,
      alternativeInspectionDate: undefined,
    });
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
    if (!formData.whatsApp) {
      confirm("WhatsApp number is required");
      return;
    }
    if (!formData.jobType) {
      confirm("Job type is required");
      return;
    }
    if (!formData.city) {
      confirm("City is required");
      return;
    }
    if (!formData.area) {
      confirm("Area is required");
      return;
    }

    try {
      if (currentInquiry?.id) {
        await updateInquiry(currentInquiry.id, formData as Inquiry);
      } else {
        await createInquiry(formData as Inquiry);
      }
      closeSidebar();
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

  const filteredInquiries = inquiries.filter(
    (inquiry: Inquiry) =>
      inquiry.whatsApp.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.area?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.buildingName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.specialRequirements
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const capitalizeFirstLetter = (str: string): string => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const formatDate = (date?: Date | string): string => {
    if (!date) return "-";
    const d = new Date(date);
    return d.toLocaleDateString();
  };

  return (
    <div className="relative space-y-4">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3 mb-4">
        <h2 className="text-xl font-semibold md:mr-4">Inquiry Management</h2>

        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search inquiries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-full"
            />
          </div>

          <Button onClick={() => openSidebar()} className="w-full md:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Add Inquiry
          </Button>
        </div>
      </div>

      {/* Inquiries Table */}
      <div className="bg-white rounded-md shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12"
                >
                  S.No.
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  WhatsApp
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Job Type
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell"
                >
                  Location
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell"
                >
                  Budget
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell"
                >
                  Inspection Date
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
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
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                    </div>
                    <p className="text-gray-500">Loading inquiries...</p>
                  </td>
                </tr>
              ) : filteredInquiries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10">
                    <p className="text-gray-500">
                      {searchTerm
                        ? "No inquiries match your search"
                        : "No inquiries found"}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredInquiries.map((inquiry: Inquiry, index: number) => (
                  <tr key={inquiry.id} className="hover:bg-gray-50">
                    <td className="px-3 py-1 whitespace-nowrap text-sm text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-3 py-1 whitespace-nowrap text-sm font-medium">
                      {inquiry.whatsApp}
                    </td>
                    <td className="px-3 py-1 whitespace-nowrap">
                      <Badge variant="outline" className="text-xs">
                        {capitalizeFirstLetter(
                          inquiry.jobType.replace(/-/g, " ")
                        )}
                      </Badge>
                    </td>
                    <td className="px-3 py-1 hidden md:table-cell">
                      <p className="text-sm text-gray-500">
                        {inquiry.city}, {inquiry.area}
                      </p>
                    </td>
                    <td className="px-3 py-1 hidden lg:table-cell">
                      <Badge variant="outline" className="text-xs">
                        {capitalizeFirstLetter(
                          inquiry.budgetRange?.replace(/-/g, " ") || ""
                        )}
                      </Badge>
                    </td>
                    <td className="px-3 py-1 hidden sm:table-cell">
                      <p className="text-sm text-gray-500">
                        {formatDate(
                          inquiry.preferredInspectionDate ?? undefined
                        )}
                      </p>
                    </td>
                    <td className="px-3 py-1 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => openSidebar(inquiry)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
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
        className={`fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-lg border-l border-gray-200 transform transition-transform duration-300 ease-in-out z-50 ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white shadow-lg transform scale-105">
            <h3 className="text-lg font-medium">
              {currentInquiry ? "Edit Inquiry" : "Add New Inquiry"}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 rounded-full"
              onClick={closeSidebar}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="p-4 flex-1 overflow-y-auto">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="jobType"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Job Type <span className="text-red-500">*</span>
                </label>
                <Select
                  value={formData.jobType}
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

              <div className="grid grid-cols-2 gap-4">
                {/* Country Select */}
                <div className="space-y-1">
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Country <span className="text-red-500">*</span>
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
                        <SelectItem key={country.isoCode} value={country.name}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* State Select */}
                <div className="space-y-1">
                  <label
                    htmlFor="state"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    State/Province <span className="text-red-500">*</span>
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
                          <SelectItem key={state.isoCode} value={state.name}>
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

                {/* City Select */}
                <div className="space-y-1">
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    City <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={formData.city || ""}
                    onValueChange={(value) => {
                      const city = cities.find((c) => c.name === value);
                      setSelectedCity(city || null);
                      handleSelectChange("city", value);
                    }}
                    disabled={!selectedState || loading || cities.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          selectedState ? "Select city" : "Select state first"
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

                {/* Area Input */}
                <div className="space-y-1">
                  <label
                    htmlFor="area"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Area/Locality <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="area"
                    name="area"
                    value={formData.area || ""}
                    onChange={handleInputChange}
                    placeholder="Enter area/locality"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label
                    htmlFor="whatsApp"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    WhatsApp Number <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="whatsApp"
                    name="whatsApp"
                    value={formData.whatsApp || ""}
                    onChange={handleInputChange}
                    placeholder="Enter WhatsApp number"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="propertyType"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Property Type
                  </label>
                  <Select
                    value={formData.propertyType}
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
                    value={formData.buildingType}
                    onValueChange={(value) =>
                      handleSelectChange("buildingType", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select building type" />
                    </SelectTrigger>
                    <SelectContent>
                      {["villa", "apartment", "shop", "office"].map((type) => (
                        <SelectItem key={type} value={type}>
                          {capitalizeFirstLetter(type)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
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
                    {["residential", "commercial", "industrial"].map((type) => (
                      <SelectItem key={type} value={type}>
                        {capitalizeFirstLetter(type)}
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
                  value={formData.budgetRange}
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
                  value={formData.projectUrgency}
                  onValueChange={(value) =>
                    handleSelectChange("projectUrgency", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select urgency" />
                  </SelectTrigger>
                  <SelectContent>
                    {["urgent", "normal", "flexible", "future-planning"].map(
                      (urgency) => (
                        <SelectItem key={urgency} value={urgency}>
                          {capitalizeFirstLetter(urgency.replace(/-/g, " "))}
                        </SelectItem>
                      )
                    )}
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
                      e.target.value ? new Date(e.target.value) : undefined
                    )
                  }
                />
              </div>

              <div>
                <label
                  htmlFor="alternativeInspectionDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Alternative Inspection Date
                </label>
                <input
                  type="date"
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
                      e.target.value ? new Date(e.target.value) : undefined
                    )
                  }
                />
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
            </form>
          </div>
          <div className="p-4 border-t bg-gray-50">
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={closeSidebar}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    <span>
                      {currentInquiry ? "Updating..." : "Creating..."}
                    </span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>{currentInquiry ? "Update" : "Create"}</span>
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
          className="fixed inset-0 bg-black bg-opacity-30 z-40"
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
