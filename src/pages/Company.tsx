// import React, { useEffect, useState } from 'react';
// import { Plus, Search, Edit2, Trash2, Building2, Mail, MapPin, Users, X } from 'lucide-react';
// import { getAllRoles, getCompanies, createCompany } from '../api/adminApi/company';

// interface Company {
//     id: number;
//     company_name: string;
//     company_code: string;
//     email: string;
//     address: string;
//     no_of_employee: string;
//     no_of_restraunt: number;
//     createddate: string;
//     updateddate: string;
// }

// interface Role {
//     id: number;
//     role_name: string;
//     // Add other role properties as needed
// }


// interface CompanyFormData {
//     company_name: string;
//     email: string;
//     password: string;
//     company_code: string;
//     no_of_employee: string;
//     no_of_restraunt: string;
//     address: string;

//     canteenid: string;
//     roleid: string;
// }

// const Company: React.FC = () => {
//     const [companies, setCompanies] = useState<Company[]>([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [showAddForm, setShowAddForm] = useState(false);
//     const [roles, setRoles] = useState<Role[]>([]);
//     const [isRolesLoading, setIsRolesLoading] = useState(false);
//     const [formData, setFormData] = useState<CompanyFormData>({
//         company_name: '',
//         email: '',
//         password: '',
//         company_code: '',
//         no_of_employee: '',
//         no_of_restraunt: '',
//         address: '',

//         canteenid: '',
//         roleid: ''
//     });
//     const [isSubmitting, setIsSubmitting] = useState(false);

//     // Helper function to map API response to component format
//     const mapApiCompanyToComponent = (apiCompany: any): Company => ({
//         id: apiCompany.id || Date.now(),
//         company_name: apiCompany.company_name || 'Unnamed Company',
//         company_code: apiCompany.company_code || 'N/A',
//         email: apiCompany.email || 'No email',
//         address: apiCompany.address || 'No address',
//         no_of_employee: apiCompany.no_of_employee || 'Unknown',
//         no_of_restraunt: apiCompany.no_of_restraunt || 0,
//         createddate: apiCompany.createddate || '',
//         updateddate: apiCompany.updateddate || ''
//     });

//     const filteredCompanies = companies.filter(company => {
//         if (!company || typeof company !== 'object') {
//             return false;
//         }

//         return (company.company_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
//             (company.company_code?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
//             (company.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
//             (company.address?.toLowerCase() || '').includes(searchTerm.toLowerCase());
//     });

//     useEffect(() => {
//         const fetchCompanies = async () => {
//             setIsLoading(true);
//             try {
//                 const response = await getCompanies({
//                     start: "0",
//                     limit: "10",
//                     search: "",
//                 });

//                 console.log("Companies API response:", response);

//                 if (response && response.data && Array.isArray(response.data)) {
//                     console.log("Setting companies from response.data:", response.data);
//                     const mappedCompanies = response.data.map(mapApiCompanyToComponent);
//                     setCompanies(mappedCompanies);
//                 } else if (Array.isArray(response)) {
//                     console.log("Setting companies from direct response:", response);
//                     const mappedCompanies = response.map(mapApiCompanyToComponent);
//                     setCompanies(mappedCompanies);
//                 } else {
//                     console.log("No valid company data found in response");
//                     setCompanies([]);
//                 }
//             } catch (error) {
//                 console.error("Failed to fetch companies:", error);
//                 setCompanies([]);
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         fetchCompanies();
//     }, []);

//     const fetchRoles = async () => {
//         setIsRolesLoading(true);
//         try {
//             const response = await getAllRoles({
//                 start: "0",
//                 limit: "100",
//                 search: "",
//             });

//             console.log("Roles API response:", response);

//             // Handle different response structures
//             if (response && response.data && Array.isArray(response.data)) {
//                 setRoles(response.data);
//             } else if (Array.isArray(response)) {
//                 setRoles(response);
//             } else if (response && Array.isArray(response.roles)) {
//                 setRoles(response.roles);
//             } else {
//                 console.error("Unexpected API response structure:", response);
//                 setRoles([]);
//             }
//         } catch (error) {
//             console.error("Failed to fetch roles:", error);
//             setRoles([]);
//         } finally {
//             setIsRolesLoading(false);
//         }
//     };
//     const handleAddCompanyClick = () => {
//         setShowAddForm(true);
//         fetchRoles();
//     };

//     const handleFormClose = () => {
//         setShowAddForm(false);
//         setFormData({
//             company_name: '',
//             email: '',
//             password: '',
//             company_code: '',
//             no_of_employee: '',
//             no_of_restraunt: '',
//             address: '',

//             canteenid: '',
//             roleid: ''
//         });
//     };

//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({
//             ...prev,
//             [name]: value
//         }));
//     };

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setIsSubmitting(true);
//         try {
//             // Use simplified create company for Super Admin basic flow
//             await createCompany({
//                 company_name: formData.company_name,
//                 address: formData.address,
//                 no_of_employee: parseInt(formData.no_of_employee || '0', 10) || 0,

//             });
//             handleFormClose();
//             // Refetch list
//             setIsLoading(true);
//             const response = await getCompanies({ start: "0", limit: "10", search: "" });
//             if (response && (response as any).data && Array.isArray((response as any).data)) {
//                 const mappedCompanies = (response as any).data.map(mapApiCompanyToComponent);
//                 setCompanies(mappedCompanies);
//             }
//         } catch (error) {
//             console.error("Failed to add company:", error);
//         } finally {
//             setIsSubmitting(false);
//             setIsLoading(false);
//         }
//     };

//     const formatDate = (dateString: string) => {
//         if (!dateString) return 'Unknown';
//         try {
//             return new Date(dateString).toLocaleDateString();
//         } catch {
//             return 'Invalid Date';
//         }
//     };


//     return (
//         <div className="space-y-6">
//             {/* Header */}
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
//                 <div>
//                     <h1 className="text-3xl font-bold text-gray-900">Companies</h1>
//                     <p className="text-gray-600 mt-1">Manage company information and details</p>
//                 </div>
//                 <button
//                     onClick={handleAddCompanyClick}
//                     className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
//                 >
//                     <Plus className="w-5 h-5" />
//                     <span>Add Company</span>
//                 </button>
//             </div>

//             {/* Add Company Form Modal */}
//             {showAddForm && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//                     <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
//                         <div className="flex items-center justify-between p-6 border-b border-gray-200">
//                             <h2 className="text-xl font-semibold text-gray-900">Add New Company</h2>
//                             <button
//                                 onClick={handleFormClose}
//                                 className="text-gray-400 hover:text-gray-600 transition-colors"
//                             >
//                                 <X className="w-6 h-6" />
//                             </button>
//                         </div>
//                         <form onSubmit={handleSubmit} className="p-6 space-y-4">
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                                         Company Name *
//                                     </label>
//                                     <input
//                                         type="text"
//                                         name="company_name"
//                                         value={formData.company_name}
//                                         onChange={handleInputChange}
//                                         required
//                                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                     />
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                                         Email *
//                                     </label>
//                                     <input
//                                         type="email"
//                                         name="email"
//                                         value={formData.email}
//                                         onChange={handleInputChange}
//                                         required
//                                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                     />
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                                         Password *
//                                     </label>
//                                     <input
//                                         type="password"
//                                         name="password"
//                                         value={formData.password}
//                                         onChange={handleInputChange}
//                                         required
//                                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                     />
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                                         Company Code *
//                                     </label>
//                                     <input
//                                         type="text"
//                                         name="company_code"
//                                         value={formData.company_code}
//                                         onChange={handleInputChange}
//                                         required
//                                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                     />
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                                         Number of Employees *
//                                     </label>
//                                     <input
//                                         type="text"
//                                         name="no_of_employee"
//                                         value={formData.no_of_employee}
//                                         onChange={handleInputChange}
//                                         required
//                                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                     />
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                                         Number of Restaurants *
//                                     </label>
//                                     <input
//                                         type="number"
//                                         name="no_of_restraunt"
//                                         value={formData.no_of_restraunt}
//                                         onChange={handleInputChange}
//                                         required
//                                         min="0"
//                                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                     />
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                                         Address *
//                                     </label>
//                                     <input
//                                         type="text"
//                                         name="address"
//                                         value={formData.address}
//                                         onChange={handleInputChange}
//                                         required
//                                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                     />
//                                 </div>

//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                                         Canteen ID *
//                                     </label>
//                                     <input
//                                         type="text"
//                                         name="canteenid"
//                                         value={formData.canteenid}
//                                         onChange={handleInputChange}
//                                         required
//                                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                     />
//                                 </div>
//                                 <div className="md:col-span-2">
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                                         Role *
//                                     </label>
//                                     {isRolesLoading ? (
//                                         <div className="flex items-center">
//                                             <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-2"></div>
//                                             <span className="text-gray-600">Loading roles...</span>
//                                         </div>
//                                     ) : (
//                                         <select
//                                             name="roleid"
//                                             value={formData.roleid}
//                                             onChange={handleInputChange}
//                                             required
//                                             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                         >
//                                             <option value="">Select a role</option>
//                                             {roles.map(role => (
//                                                 <option key={role.id} value={role.id}>
//                                                     {role.role_name || role.name}
//                                                 </option>
//                                             ))}
//                                         </select>
//                                     )}
//                                 </div>
//                             </div>
//                             <div className="flex justify-end space-x-3 pt-4">
//                                 <button
//                                     type="button"
//                                     onClick={handleFormClose}
//                                     className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button
//                                     type="submit"
//                                     disabled={isSubmitting}
//                                     className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                                 >
//                                     {isSubmitting ? (
//                                         <div className="flex items-center">
//                                             <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                                             Adding...
//                                         </div>
//                                     ) : (
//                                         'Add Company'
//                                     )}
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}

//             {/* Search */}
//             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//                 <div className="relative">
//                     <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//                     <input
//                         type="text"
//                         placeholder="Search companies by name, code, email, or address..."
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                         className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                 </div>
//             </div>

//             {/* Loading State */}
//             {isLoading && (
//                 <div className="flex items-center justify-center py-12">
//                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//                     <span className="ml-3 text-gray-600">Loading companies...</span>
//                 </div>
//             )}

//             {/* Companies Grid */}
//             {!isLoading && (
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                     {filteredCompanies.map((company, index) => (
//                         <div key={company.id || `company-${index}`} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
//                             <div className="flex items-start justify-between mb-4">
//                                 <div className="flex-1">
//                                     <h3 className="text-xl font-semibold text-gray-900 mb-2">{company.company_name}</h3>
//                                     <div className="space-y-2">
//                                         <div className="flex items-center space-x-2 text-gray-600">
//                                             <Building2 className="w-4 h-4" />
//                                             <span className="text-sm">{company.company_code}</span>
//                                         </div>
//                                         <div className="flex items-center space-x-2 text-gray-600">
//                                             <Mail className="w-4 h-4" />
//                                             <span className="text-sm">{company.email}</span>
//                                         </div>
//                                         <div className="flex items-center space-x-2 text-gray-600">
//                                             <MapPin className="w-4 h-4" />
//                                             <span className="text-sm">{company.address}</span>
//                                         </div>
//                                     </div>
//                                 </div>
//                                 <span className="px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800">
//                                     Active
//                                 </span>
//                             </div>

//                             <div className="mb-4">
//                                 <div className="flex items-center space-x-4 text-sm text-gray-600">
//                                     <div className="flex items-center space-x-1">
//                                         <Users className="w-4 h-4" />
//                                         <span>{company.no_of_employee} employees</span>
//                                     </div>
//                                     <div className="flex items-center space-x-1">
//                                         <Building2 className="w-4 h-4" />
//                                         <span>{company.no_of_restraunt} restaurants</span>
//                                     </div>
//                                 </div>
//                                 <p className="text-sm text-gray-500 mt-2">
//                                     Created: {formatDate(company.createddate)}
//                                 </p>
//                             </div>

//                             <div className="flex justify-end space-x-2">
//                                 <button
//                                     onClick={() => {/* Edit functionality */ }}
//                                     className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                                 >
//                                     <Edit2 className="w-4 h-4" />
//                                 </button>
//                                 <button
//                                     onClick={() => {/* Delete functionality */ }}
//                                     className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                                 >
//                                     <Trash2 className="w-4 h-4" />
//                                 </button>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             )}

//             {!isLoading && filteredCompanies.length === 0 && (
//                 <div className="text-center py-12">
//                     <p className="text-gray-500">
//                         {searchTerm ? 'No companies found matching your search.' : 'No companies available. Add your first company to get started.'}
//                     </p>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Company;
import React, { useEffect, useState } from 'react';
import { Plus, Search, Edit2, Trash2, Building2, Mail, MapPin, Users, X, Eye, EyeOff } from 'lucide-react';
import { getAllRoles, getCompanies, createCompany, updateCompany } from '../api/adminApi/company';

interface Company {
    id: number;
    company_name: string;
    company_code: string;
    email: string;
    address: string;
    no_of_employee: string;
    no_of_restraunt: number;
    createddate: string;
    updateddate: string;
    status?: string;
}

interface Role {
    id: number;
    role_name: string;
}

interface CompanyFormData {
    company_name: string;
    email: string;
    password: string;
    company_code: string;
    no_of_employee: string;
    no_of_restraunt: string;
    address: string;
    roleid: string;
}

const Company: React.FC = () => {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [roles, setRoles] = useState<Role[]>([]);
    const [isRolesLoading, setIsRolesLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [showEditForm, setShowEditForm] = useState(false);
    const [editingCompanyId, setEditingCompanyId] = useState<string | null>(null);
    const [editSubmitting, setEditSubmitting] = useState(false);
    const [editData, setEditData] = useState<{ name: string; email: string; password: string }>({ name: '', email: '', password: '' });

    const [formData, setFormData] = useState<CompanyFormData>({
        company_name: '',
        email: '',
        password: '',
        company_code: '',
        no_of_employee: '',
        no_of_restraunt: '',
        address: '',
        roleid: ''
    });

    const mapApiCompanyToComponent = (apiCompany: any): Company => ({
        id: apiCompany.id || Date.now(),
        company_name: apiCompany.company_name || 'Unnamed Company',
        company_code: apiCompany.company_code || 'N/A',
        email: apiCompany.email || 'No email',
        address: apiCompany.address || 'No address',
        no_of_employee: apiCompany.no_of_employee || 'Unknown',
        no_of_restraunt: apiCompany.no_of_restraunt || 0,
        createddate: apiCompany.createddate || '',
        updateddate: apiCompany.updateddate || '',
        status: apiCompany.status || 'Active'
    });

    const filteredCompanies = companies.filter(company => {
        if (!company || typeof company !== 'object') {
            return false;
        }

        return (company.company_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (company.company_code?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (company.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (company.address?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    });

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        setIsLoading(true);
        try {
            const response = await getCompanies({
                start: "0",
                limit: "100",
                search: "",
            });

            console.log("Companies API response:", response);

            if (response && response.data && Array.isArray(response.data)) {
                console.log("Setting companies from response.data:", response.data);
                const mappedCompanies = response.data.map(mapApiCompanyToComponent);
                setCompanies(mappedCompanies);
            } else if (Array.isArray(response)) {
                console.log("Setting companies from direct response:", response);
                const mappedCompanies = response.map(mapApiCompanyToComponent);
                setCompanies(mappedCompanies);
            } else {
                console.log("No valid company data found in response");
                setCompanies([]);
            }
        } catch (error) {
            console.error("Failed to fetch companies:", error);
            setCompanies([]);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchRoles = async () => {
        setIsRolesLoading(true);
        try {
            const response = await getAllRoles({
                start: "0",
                limit: "100",
                search: "",
            });
            if (response && response.data && Array.isArray(response.data)) {
                setRoles(response.data);
            } else if (Array.isArray(response)) {
                setRoles(response);
            } else if (response && Array.isArray(response.roles)) {
                setRoles(response.roles);
            } else {
                console.error("Unexpected API response structure:", response);
                setRoles([]);
            }
        } catch (error) {
            console.error("Failed to fetch roles:", error);
            setRoles([]);
        } finally {
            setIsRolesLoading(false);
        }
    };

    const validateForm = () => {
        const errors: Record<string, string> = {};

        if (!formData.company_name.trim()) errors.company_name = "Company name is required";
        if (!formData.email.trim()) errors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Email is invalid";
        if (!formData.password) errors.password = "Password is required";
        else if (formData.password.length < 6) errors.password = "Password must be at least 6 characters";
        if (!formData.company_code.trim()) errors.company_code = "Company code is required";
        if (!formData.no_of_employee.trim()) errors.no_of_employee = "Number of employees is required";
        if (!formData.no_of_restraunt.trim()) errors.no_of_restraunt = "Number of restaurants is required";
        if (!formData.address.trim()) errors.address = "Address is required";
        if (!formData.roleid) errors.roleid = "Role is required";

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleAddCompanyClick = () => {
        setShowAddForm(true);
        setFormErrors({});
        fetchRoles();
    };

    const handleFormClose = () => {
        setShowAddForm(false);
        setFormData({
            company_name: '',
            email: '',
            password: '',
            company_code: '',
            no_of_employee: '',
            no_of_restraunt: '',
            address: '',
            roleid: ''
        });
        setFormErrors({});
        setShowPassword(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (formErrors[name]) {
            setFormErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            // Prepare the payload according to API requirements
            const payload = {
                company_name: formData.company_name,
                email: formData.email,
                password: formData.password,
                company_code: formData.company_code,
                no_of_employee: formData.no_of_employee,
                no_of_restraunt: formData.no_of_restraunt,
                address: formData.address,
                roleid: formData.roleid
            };

            console.log("Submitting company data:", payload);

            // Call the API to create company
            const response = await createCompany(payload);
            console.log("Company created successfully:", response);

            // Show success message
            alert("Company created successfully!");

            // Close the form and refresh the company list
            handleFormClose();
            fetchCompanies();

        } catch (error: any) {
            console.error("Failed to add company:", error);

            // Handle API errors
            if (error.response?.data?.message) {
                alert(`Error: ${error.response.data.message}`);
            } else {
                alert("Failed to create company. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return 'Unknown';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch {
            return 'Invalid Date';
        }
    };

    const getStatusColor = (status: string = 'Active') => {
        switch (status.toLowerCase()) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'inactive': return 'bg-red-100 text-red-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const openEdit = (company: Company) => {
        // Assuming backend expects keys: name, email, password
        setEditingCompanyId(String(company.id));
        setEditData({ name: company.company_name || '', email: company.email || '', password: '' });
        setShowEditForm(true);
    };

    const closeEdit = () => {
        setShowEditForm(false);
        setEditingCompanyId(null);
        setEditData({ name: '', email: '', password: '' });
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditData(prev => ({ ...prev, [name]: value }));
    };

    const submitEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingCompanyId) return;
        setEditSubmitting(true);
        try {
            // Build patch payload with only changed (and non-empty) fields
            const original = companies.find(c => String(c.id) === editingCompanyId);
            const payload: { name?: string; email?: string; password?: string } = {};
            if (original) {
                if (editData.name.trim() && editData.name.trim() !== (original.company_name || '')) payload.name = editData.name.trim();
                if (editData.email.trim() && editData.email.trim() !== (original.email || '')) payload.email = editData.email.trim();
            } else {
                if (editData.name.trim()) payload.name = editData.name.trim();
                if (editData.email.trim()) payload.email = editData.email.trim();
            }
            if (editData.password.trim()) payload.password = editData.password.trim();

            if (Object.keys(payload).length === 0) {
                alert('No changes to save');
                setEditSubmitting(false);
                return;
            }

            await updateCompany(editingCompanyId, payload);
            alert('Company updated successfully');
            closeEdit();
            fetchCompanies();
        } catch (error: any) {
            console.error('Failed to update company:', error);
            if (error.response?.data?.message) {
                alert(`Error: ${error.response.data.message}`);
            } else {
                alert('Failed to update company. Please try again.');
            }
        } finally {
            setEditSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Companies</h1>
                    <p className="text-gray-600 mt-1">Manage company information and details</p>
                </div>
                <button
                    onClick={handleAddCompanyClick}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                >
                    <Plus className="w-5 h-5" />
                    <span>Add Company</span>
                </button>
            </div>

            {showAddForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
                            <h2 className="text-xl font-semibold text-gray-900">Add New Company</h2>
                            <button
                                onClick={handleFormClose}
                                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Company Name */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Company Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="company_name"
                                        value={formData.company_name}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors.company_name ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="Enter company name"
                                    />
                                    {formErrors.company_name && (
                                        <p className="mt-1 text-sm text-red-600">{formErrors.company_name}</p>
                                    )}
                                </div>

                                {/* Email */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors.email ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="Enter company email"
                                    />
                                    {formErrors.email && (
                                        <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                                    )}
                                </div>

                                {/* Password */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Password *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors.password ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            placeholder="Enter password"
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    {formErrors.password && (
                                        <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
                                    )}
                                </div>

                                {/* Company Code */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Company Code *
                                    </label>
                                    <input
                                        type="text"
                                        name="company_code"
                                        value={formData.company_code}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors.company_code ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="Enter company code"
                                    />
                                    {formErrors.company_code && (
                                        <p className="mt-1 text-sm text-red-600">{formErrors.company_code}</p>
                                    )}
                                </div>

                                {/* Number of Employees */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Number of Employees *
                                    </label>
                                    <input
                                        type="text"
                                        name="no_of_employee"
                                        value={formData.no_of_employee}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors.no_of_employee ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="e.g., 50-200"
                                    />
                                    {formErrors.no_of_employee && (
                                        <p className="mt-1 text-sm text-red-600">{formErrors.no_of_employee}</p>
                                    )}
                                </div>

                                {/* Number of Restaurants */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Number of Restaurants *
                                    </label>
                                    <input
                                        type="text"
                                        name="no_of_restraunt"
                                        value={formData.no_of_restraunt}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors.no_of_restraunt ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="Enter number"
                                    />
                                    {formErrors.no_of_restraunt && (
                                        <p className="mt-1 text-sm text-red-600">{formErrors.no_of_restraunt}</p>
                                    )}
                                </div>

                                {/* Address */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Address *
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors.address ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="Enter company address"
                                    />
                                    {formErrors.address && (
                                        <p className="mt-1 text-sm text-red-600">{formErrors.address}</p>
                                    )}
                                </div>

                                {/* Role Selection */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Role *
                                    </label>
                                    {isRolesLoading ? (
                                        <div className="flex items-center">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-2"></div>
                                            <span className="text-gray-600">Loading roles...</span>
                                        </div>
                                    ) : (
                                        <select
                                            name="roleid"
                                            value={formData.roleid}
                                            onChange={handleInputChange}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors.roleid ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                        >
                                            <option value="">Select a role</option>
                                            {roles.map(role => (
                                                <option key={role.id} value={role.id}>
                                                    {role.role_name || role.name}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                    {formErrors.roleid && (
                                        <p className="mt-1 text-sm text-red-600">{formErrors.roleid}</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 mt-6">
                                <button
                                    type="button"
                                    onClick={handleFormClose}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Adding...
                                        </>
                                    ) : (
                                        'Add Company'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Company Form Modal */}
            {showEditForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">Edit Company</h2>
                            <button onClick={closeEdit} className="text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={submitEdit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={editData.name}
                                    onChange={handleEditChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    // type="email"
                                    name="email"
                                    value={editData.email}
                                    onChange={handleEditChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={editData.password}
                                    onChange={handleEditChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div className="flex justify-end space-x-2 pt-2">
                                <button type="button" onClick={closeEdit} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
                                <button type="submit" disabled={editSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
                                    {editSubmitting ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Search */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search companies by name, code, email, or address..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>

            {isLoading && (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">Loading companies...</span>
                </div>
            )}

            {!isLoading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCompanies.map((company, index) => (
                        <div key={company.id || `company-${index}`} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{company.company_name}</h3>
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-2 text-gray-600">
                                            <Building2 className="w-4 h-4" />
                                            <span className="text-sm">{company.company_code}</span>
                                        </div>
                                        <div className="flex items-center space-x-2 text-gray-600">
                                            <Mail className="w-4 h-4" />
                                            <span className="text-sm">{company.email}</span>
                                        </div>
                                        <div className="flex items-center space-x-2 text-gray-600">
                                            <MapPin className="w-4 h-4" />
                                            <span className="text-sm">{company.address}</span>
                                        </div>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(company.status)}`}>
                                    {company.status || 'Active'}
                                </span>
                            </div>

                            <div className="mb-4">
                                <div className="flex items-center space-x-4 text-sm text-gray-600">
                                    <div className="flex items-center space-x-1">
                                        <Users className="w-4 h-4" />
                                        <span>{company.no_of_employee} employees</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <Building2 className="w-4 h-4" />
                                        <span>{company.no_of_restraunt} restaurants</span>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500 mt-2">
                                    Created: {formatDate(company.createddate)}
                                </p>
                                {company.updateddate && company.updateddate !== company.createddate && (
                                    <p className="text-sm text-gray-500">
                                        Updated: {formatDate(company.updateddate)}
                                    </p>
                                )}
                            </div>

                            <div className="flex justify-end space-x-2">
                                <button
                                    onClick={() => openEdit(company)}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    title="Edit company"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => {/* Delete functionality */ }}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Delete company"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!isLoading && filteredCompanies.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
                    <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {searchTerm ? 'No companies found' : 'No companies yet'}
                    </h3>
                    <p className="text-gray-500 mb-4">
                        {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first company'}
                    </p>
                    {!searchTerm && (
                        <button
                            onClick={handleAddCompanyClick}
                            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors mx-auto"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Add Company</span>
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default Company; 