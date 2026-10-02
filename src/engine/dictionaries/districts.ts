export interface DictionaryEntry {
  canonicalEn: string;
  canonicalBn: string;
  aliases: string[];
}

/**
 * 64 Administrative Districts of Bangladesh with common English spelling variants
 * and standard Bengali Unicode names.
 */
export const DISTRICTS: DictionaryEntry[] = [
  // Dhaka Division
  { canonicalEn: 'Dhaka', canonicalBn: 'ঢাকা', aliases: ['dhaka', 'dacca', 'ঢাকা'] },
  { canonicalEn: 'Gazipur', canonicalBn: 'গাজীপুর', aliases: ['gazipur', 'গাজীপুর'] },
  { canonicalEn: 'Kishoreganj', canonicalBn: 'কিশোরগঞ্জ', aliases: ['kishoreganj', 'kishorganj', 'কিশোরগঞ্জ'] },
  { canonicalEn: 'Manikganj', canonicalBn: 'মানিকগঞ্জ', aliases: ['manikganj', 'manikgonj', 'মানিকগঞ্জ'] },
  { canonicalEn: 'Munshiganj', canonicalBn: 'মুন্সীগঞ্জ', aliases: ['munshiganj', 'munshigonj', 'মুন্সীগঞ্জ', 'মুন্সিগঞ্জ'] },
  { canonicalEn: 'Narayanganj', canonicalBn: 'নারায়ণগঞ্জ', aliases: ['narayanganj', 'narayangonj', 'নারায়ণগঞ্জ'] },
  { canonicalEn: 'Narsingdi', canonicalBn: 'নরসিংদী', aliases: ['narsingdi', 'নরসিংদী', 'নরসিংদি'] },
  { canonicalEn: 'Tangail', canonicalBn: 'টাঙ্গাইল', aliases: ['tangail', 'টাঙ্গাইল'] },
  { canonicalEn: 'Faridpur', canonicalBn: 'ফরিদপুর', aliases: ['faridpur', 'ফরিদপুর'] },
  { canonicalEn: 'Gopalganj', canonicalBn: 'গোপালগঞ্জ', aliases: ['gopalganj', 'gopalgonj', 'গোপালগঞ্জ'] },
  { canonicalEn: 'Madaripur', canonicalBn: 'মাদারীপুর', aliases: ['madaripur', 'মাদারীপুর', 'মাদারিপুর'] },
  { canonicalEn: 'Rajbari', canonicalBn: 'রাজবাড়ী', aliases: ['rajbari', 'রাজবাড়ী', 'রাজবাড়ি'] },
  { canonicalEn: 'Shariatpur', canonicalBn: 'শরীয়তপুর', aliases: ['shariatpur', 'শরীয়তপুর', 'শরিয়তপুর'] },

  // Chattogram Division
  { canonicalEn: 'Chattogram', canonicalBn: 'চট্টগ্রাম', aliases: ['chattogram', 'chittagong', 'ctg', 'চট্টগ্রাম'] },
  { canonicalEn: "Cox's Bazar", canonicalBn: 'কক্সবাজার', aliases: ["cox's bazar", 'coxs bazar', 'coxsbazar', 'কক্সবাজার'] },
  { canonicalEn: 'Cumilla', canonicalBn: 'কুমিল্লা', aliases: ['cumilla', 'comilla', 'কুমিল্লা'] },
  { canonicalEn: 'Brahmanbaria', canonicalBn: 'ব্রাহ্মণবাড়িয়া', aliases: ['brahmanbaria', 'b.baria', 'ব্রাহ্মণবাড়িয়া', 'ব্রাক্ষণবাড়িয়া'] },
  { canonicalEn: 'Chandpur', canonicalBn: 'চাঁদপুর', aliases: ['chandpur', 'চাঁদপুর'] },
  { canonicalEn: 'Lakshmipur', canonicalBn: 'লক্ষ্মীপুর', aliases: ['lakshmipur', 'laxmipur', 'লক্ষ্মীপুর', 'লক্ষীপুর'] },
  { canonicalEn: 'Noakhali', canonicalBn: 'নোয়াখালী', aliases: ['noakhali', 'নোয়াখালী'] },
  { canonicalEn: 'Feni', canonicalBn: 'ফেনী', aliases: ['feni', 'ফেনী', 'ফেনি'] },
  { canonicalEn: 'Khagrachhari', canonicalBn: 'খাগড়াছড়ি', aliases: ['khagrachhari', 'khagrachari', 'খাগড়াছড়ি', 'খাগড়াছড়ি'] },
  { canonicalEn: 'Rangamati', canonicalBn: 'রাঙ্গামাটি', aliases: ['rangamati', 'রাঙ্গামাটি', 'রাঙামাটি'] },
  { canonicalEn: 'Bandarban', canonicalBn: 'বান্দরবান', aliases: ['bandarban', 'বান্দরবান'] },

  // Rajshahi Division
  { canonicalEn: 'Rajshahi', canonicalBn: 'রাজশাহী', aliases: ['rajshahi', 'রাজশাহী'] },
  { canonicalEn: 'Bogura', canonicalBn: 'বগুড়া', aliases: ['bogura', 'bogra', 'বগুড়া', 'বগুড়া'] },
  { canonicalEn: 'Joypurhat', canonicalBn: 'জয়পুরহাট', aliases: ['joypurhat', 'জয়পুরহাট'] },
  { canonicalEn: 'Naogaon', canonicalBn: 'নওগাঁ', aliases: ['naogaon', 'নওগাঁ'] },
  { canonicalEn: 'Natore', canonicalBn: 'নাটোর', aliases: ['natore', 'নাটোর'] },
  { canonicalEn: 'Chapainawabganj', canonicalBn: 'চাঁপাইনবাবগঞ্জ', aliases: ['chapainawabganj', 'nawabganj', 'চাঁপাইনবাবগঞ্জ', 'নবাবগঞ্জ'] },
  { canonicalEn: 'Pabna', canonicalBn: 'পাবনা', aliases: ['pabna', 'পাবনা'] },
  { canonicalEn: 'Sirajganj', canonicalBn: 'সিরাজগঞ্জ', aliases: ['sirajganj', 'sirajgonj', 'সিরাজগঞ্জ'] },

  // Khulna Division
  { canonicalEn: 'Khulna', canonicalBn: 'খুলনা', aliases: ['khulna', 'খুলনা'] },
  { canonicalEn: 'Bagerhat', canonicalBn: 'বাগেরহাট', aliases: ['bagerhat', 'বাগেরহাট'] },
  { canonicalEn: 'Chuadanga', canonicalBn: 'চুয়াডাঙ্গা', aliases: ['chuadanga', 'চুয়াডাঙ্গা'] },
  { canonicalEn: 'Jashore', canonicalBn: 'যশোর', aliases: ['jashore', 'jessore', 'যশোর'] },
  { canonicalEn: 'Jhenaidah', canonicalBn: 'ঝিনাইদহ', aliases: ['jhenaidah', 'jhenaidaha', 'ঝিনাইদহ'] },
  { canonicalEn: 'Kushtia', canonicalBn: 'কুষ্টিয়া', aliases: ['kushtia', 'কুষ্টিয়া'] },
  { canonicalEn: 'Magura', canonicalBn: 'মাগুরা', aliases: ['magura', 'মাগুরা'] },
  { canonicalEn: 'Meherpur', canonicalBn: 'মেহেরপুর', aliases: ['meherpur', 'মেহেরপুর'] },
  { canonicalEn: 'Narail', canonicalBn: 'নড়াইল', aliases: ['narail', 'নড়াইল', 'নড়াইল'] },
  { canonicalEn: 'Satkhira', canonicalBn: 'সাতক্ষীরা', aliases: ['satkhira', 'সাতক্ষীরা'] },

  // Barishal Division
  { canonicalEn: 'Barishal', canonicalBn: 'বরিশাল', aliases: ['barishal', 'barisal', 'বরিশাল'] },
  { canonicalEn: 'Barguna', canonicalBn: 'বরগুনা', aliases: ['barguna', 'বরগুনা'] },
  { canonicalEn: 'Bhola', canonicalBn: 'ভোলা', aliases: ['bhola', 'ভোলা'] },
  { canonicalEn: 'Jhalokati', canonicalBn: 'ঝালকাঠি', aliases: ['jhalokati', 'jhalakati', 'ঝালকাঠি', 'ঝালকাঠী'] },
  { canonicalEn: 'Patuakhali', canonicalBn: 'পটুয়াখালী', aliases: ['patuakhali', 'পটুয়াখালী'] },
  { canonicalEn: 'Pirojpur', canonicalBn: 'পিরোজপুর', aliases: ['pirojpur', 'পিরোজপুর'] },

  // Sylhet Division
  { canonicalEn: 'Sylhet', canonicalBn: 'সিলেট', aliases: ['sylhet', 'সিলেট'] },
  { canonicalEn: 'Habiganj', canonicalBn: 'হবিগঞ্জ', aliases: ['habiganj', 'habigonj', 'হবিগঞ্জ'] },
  { canonicalEn: 'Moulvibazar', canonicalBn: 'মৌলভীবাজার', aliases: ['moulvibazar', 'moulvibazar', 'মৌলভীবাজার', 'মৌলভিবাজার'] },
  { canonicalEn: 'Sunamganj', canonicalBn: 'সুনামগঞ্জ', aliases: ['sunamganj', 'sunamgonj', 'সুনামগঞ্জ'] },

  // Rangpur Division
  { canonicalEn: 'Rangpur', canonicalBn: 'রংপুর', aliases: ['rangpur', 'রংপুর'] },
  { canonicalEn: 'Dinajpur', canonicalBn: 'দিনাজপুর', aliases: ['dinajpur', 'দিনাজপুর'] },
  { canonicalEn: 'Gaibandha', canonicalBn: 'গাইবান্ধা', aliases: ['gaibandha', 'গাইবান্ধা'] },
  { canonicalEn: 'Kurigram', canonicalBn: 'কুড়িগ্রাম', aliases: ['kurigram', 'কুড়িগ্রাম', 'কুড়িগ্রাম'] },
  { canonicalEn: 'Lalmonirhat', canonicalBn: 'লালমনিরহাট', aliases: ['lalmonirhat', 'লালমনিরহাট'] },
  { canonicalEn: 'Nilphamari', canonicalBn: 'নীলফামারী', aliases: ['nilphamari', 'নীলফামারী', 'নীলফামারি'] },
  { canonicalEn: 'Panchagarh', canonicalBn: 'পঞ্চগড়', aliases: ['panchagarh', 'পঞ্চগড়', 'পঞ্চগড়'] },
  { canonicalEn: 'Thakurgaon', canonicalBn: 'ঠাকুরগাঁও', aliases: ['thakurgaon', 'ঠাকুরগাঁও'] },

  // Mymensingh Division
  { canonicalEn: 'Mymensingh', canonicalBn: 'ময়মনসিংহ', aliases: ['mymensingh', 'ময়মনসিংহ', 'ময়মনসিংহ'] },
  { canonicalEn: 'Jamalpur', canonicalBn: 'জামালপুর', aliases: ['jamalpur', 'জামালপুর'] },
  { canonicalEn: 'Netrokona', canonicalBn: 'নেত্রকোণা', aliases: ['netrokona', 'netrakona', 'নেত্রকোণা', 'নেত্রকোনা'] },
  { canonicalEn: 'Sherpur', canonicalBn: 'শেরপুর', aliases: ['sherpur', 'শেরপুর'] },
];
