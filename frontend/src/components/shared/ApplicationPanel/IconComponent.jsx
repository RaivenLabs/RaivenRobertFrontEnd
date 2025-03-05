// src/components/shared/ApplicationPanel/IconComponent.jsx
import {
    FileText,
    Book,
    Film,
    MapPin,
    Activity,
    Mountain,
    CheckSquare,
    GraduationCap,
    Coffee,
    DollarSign,
    Home,
    Monitor,
    Palette,
    Globe,
    Users,
    MessageCircle
  } from 'lucide-react';
  
  // Map categories/contexts to appropriate Lucide icons
  const categoryToIcon = {
    'Entertainment': Film,
    'Travel': MapPin,
    'Sports': Activity,
    'Outdoor': Mountain,
    'Productivity': CheckSquare,
    'Academic': GraduationCap,
    'Culinary': Coffee,
    'Finance': DollarSign,
    'Home': Home,
    'Digital': Monitor,
    'Creative': Palette,
    'Language': Globe,
    'Family': Users,
    'Communication': MessageCircle,
    'Books': Book
  };
  
  const IconComponent = ({ iconName = '', className = '' }) => {
    // Try to match against category icons
    const categoryMatch = Object.entries(categoryToIcon).find(([key]) => 
      iconName.toLowerCase().includes(key.toLowerCase())
    );
    
    // Use matched icon or FileText as fallback
    const Icon = (categoryMatch ? categoryMatch[1] : FileText);
  
    return <Icon className={className} size={24} />;
  };
  
  export default IconComponent;
