import ShowroomIcon from './Showroom';
import RentalIcon from './Rental';
import MechanicIcon from './Mechanic';
import PartsIcon from './Parts';
import GeneralServiceIcon from './GeneralService';
import PaintIcon from './Paint';
import DetailingIcon from './Detailing';
import TuningIcon from './Tuning';
import AccessoriesIcon from './Accessories';
import CarWashIcon from './CarWash';

// Map of shop type IDs to their respective icon components
const ShopTypeIcons = {
  1: ShowroomIcon,       // Showroom
  2: RentalIcon,         // Rental
  3: MechanicIcon,       // Mechanic
  4: PartsIcon,          // Parts
  5: GeneralServiceIcon, // General Service
  6: PaintIcon,          // Paint
  7: DetailingIcon,      // Detailing
  8: TuningIcon,         // Tuning
  9: AccessoriesIcon,    // Accessories
  10: CarWashIcon        // Car Wash
};

export {
  ShowroomIcon,
  RentalIcon,
  MechanicIcon,
  PartsIcon,
  GeneralServiceIcon,
  PaintIcon,
  DetailingIcon,
  TuningIcon,
  AccessoriesIcon,
  CarWashIcon,
  ShopTypeIcons
};
