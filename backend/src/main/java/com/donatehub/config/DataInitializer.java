package com.donatehub.config;

import com.donatehub.entity.*;
import com.donatehub.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final AdminRepository adminRepository;
    private final UserRepository userRepository;
    private final DonorRepository donorRepository;
    private final ItemCategoryRepository categoryRepository;
    private final DonationDriveRepository driveRepository;
    private final DonatedItemRepository itemRepository;
    private final RecipientRepository recipientRepository;
    private final DistributionRepository distributionRepository;
    private final AuditLogRepository auditLogRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(AdminRepository adminRepository,
                           UserRepository userRepository,
                           DonorRepository donorRepository,
                           ItemCategoryRepository categoryRepository,
                           DonationDriveRepository driveRepository,
                           DonatedItemRepository itemRepository,
                           RecipientRepository recipientRepository,
                           DistributionRepository distributionRepository,
                           AuditLogRepository auditLogRepository,
                           PasswordEncoder passwordEncoder) {
        this.adminRepository = adminRepository;
        this.userRepository = userRepository;
        this.donorRepository = donorRepository;
        this.categoryRepository = categoryRepository;
        this.driveRepository = driveRepository;
        this.itemRepository = itemRepository;
        this.recipientRepository = recipientRepository;
        this.distributionRepository = distributionRepository;
        this.auditLogRepository = auditLogRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // 1. Seed Default Admin if not present
        Admin defaultAdmin;
        if (!adminRepository.existsByEmail("admin@donatehub.com")) {
            defaultAdmin = new Admin("System Administrator", "admin@donatehub.com",
                    passwordEncoder.encode("Admin@123"), "ROLE_ADMIN");
            defaultAdmin = adminRepository.save(defaultAdmin);
            auditLogRepository.save(new AuditLog(defaultAdmin.getId(), "SEED", "ADMIN", defaultAdmin.getId(), "Initialized system administrator"));
        } else {
            defaultAdmin = adminRepository.findByEmail("admin@donatehub.com").get();
        }

        // 2. Seed 5 Item Categories if empty
        List<ItemCategory> categories = new ArrayList<>();
        if (categoryRepository.count() == 0) {
            categories.add(categoryRepository.save(new ItemCategory("Winter Clothing", "Warm coats, jackets, sweaters, woolen scarves and thermal wear")));
            categories.add(categoryRepository.save(new ItemCategory("Children's Books", "Picture books, storybooks, early learning materials and encyclopedias")));
            categories.add(categoryRepository.save(new ItemCategory("School Textbooks", "Grade 1-12 curriculum textbooks, science guides and reference manuals")));
            categories.add(categoryRepository.save(new ItemCategory("Men's Everyday Wear", "Shirts, t-shirts, trousers, jeans and casual athletic clothing")));
            categories.add(categoryRepository.save(new ItemCategory("Women's Casual & Ethnic", "Kurtas, dresses, jackets, shirts and ethnic traditional wear")));
        } else {
            categories = categoryRepository.findAll();
        }

        // 3. Seed 3 Donation Drives if empty
        List<DonationDrive> drives = new ArrayList<>();
        if (driveRepository.count() == 0) {
            DonationDrive d1 = new DonationDrive();
            d1.setName("Winter Warmth Drive 2026");
            d1.setDescription("Collecting warm clothes, blankets, and jackets for underserved homeless communities during harsh winter months.");
            d1.setStartDate(LocalDate.now().minusDays(20));
            d1.setEndDate(LocalDate.now().plusDays(40));
            d1.setLocation("Central Community Hall, North Wing, Metro Station Road");
            d1.setStatus("ACTIVE");
            drives.add(driveRepository.save(d1));

            DonationDrive d2 = new DonationDrive();
            d2.setName("Back-to-School Literacy Drive");
            d2.setDescription("Collecting educational textbooks, fiction, and storybooks for community learning centers and rural libraries.");
            d2.setStartDate(LocalDate.now().minusDays(15));
            d2.setEndDate(LocalDate.now().plusDays(25));
            d2.setLocation("City Public Library Hub, Civic Center Boulevard");
            d2.setStatus("ACTIVE");
            drives.add(driveRepository.save(d2));

            DonationDrive d3 = new DonationDrive();
            d3.setName("Spring Clothes Recycling & Sharing Initiative");
            d3.setDescription("Annual spring drive collecting gently used everyday casual clothes for transition shelters and family relief.");
            d3.setStartDate(LocalDate.now().minusMonths(2));
            d3.setEndDate(LocalDate.now().minusDays(5));
            d3.setLocation("St. Jude Community Outreach Center, East Square");
            d3.setStatus("COMPLETED");
            drives.add(driveRepository.save(d3));
        } else {
            drives = driveRepository.findAll();
        }

        // 4. Seed 5 Realistic Users & Linked Donors if empty
        List<User> users = new ArrayList<>();
        List<Donor> donors = new ArrayList<>();
        if (userRepository.count() == 0) {
            String encodedPw = passwordEncoder.encode("User@123");

            String[][] userData = {
                    {"Sarah Jenkins", "sarah.jenkins@example.com", "+1-555-0101", "742 Evergreen Terrace, Springfield"},
                    {"Michael Chang", "michael.chang@example.com", "+1-555-0102", "124 Conch Street, Bay Area"},
                    {"Elena Rostova", "elena.rostova@example.com", "+1-555-0103", "456 Oakwood Avenue, Brookline"},
                    {"David Miller", "david.miller@example.com", "+1-555-0104", "88 Kingfisher Court, Seattle"},
                    {"Priya Sharma", "priya.sharma@example.com", "+1-555-0105", "23 Lotus Lane, Riverdale"}
            };

            for (String[] u : userData) {
                User user = new User(u[0], u[1], u[2], encodedPw, u[3], "ROLE_USER");
                User savedUser = userRepository.save(user);
                users.add(savedUser);

                Donor donor = new Donor(savedUser, savedUser.getFullName(), savedUser.getEmail(), savedUser.getPhone(), savedUser.getAddress());
                donors.add(donorRepository.save(donor));
            }
        } else {
            users = userRepository.findAll();
            donors = donorRepository.findAll();
        }

        // 5. Seed 3 Recipient Organizations if empty
        List<Recipient> recipients = new ArrayList<>();
        if (recipientRepository.count() == 0) {
            recipients.add(recipientRepository.save(new Recipient(
                    "Hope Horizon Children's Home",
                    "Sister Claire Matthews",
                    "contact@hopehorizon.org",
                    "+1-555-0201",
                    "100 Pine Hill Road, Shelter District",
                    "ORPHANAGE"
            )));
            recipients.add(recipientRepository.save(new Recipient(
                    "Sunrise Community Night Shelter",
                    "Marcus Vance",
                    "info@sunriseshelter.org",
                    "+1-555-0202",
                    "42 Harbor Point Way, Downtown",
                    "SHELTER"
            )));
            recipients.add(recipientRepository.save(new Recipient(
                    "Bright Minds Rural School Foundation",
                    "Dr. Anita Ray",
                    "outreach@brightmindsschool.org",
                    "+1-555-0203",
                    "Highway 9 Education Camp, Rural Sector 4",
                    "SCHOOL"
            )));
        } else {
            recipients = recipientRepository.findAll();
        }

        // 6. Seed 10 Donated Items if empty
        List<DonatedItem> items = new ArrayList<>();
        if (itemRepository.count() == 0 && !donors.isEmpty() && !categories.isEmpty() && !drives.isEmpty()) {
            Object[][] itemsData = {
                    {0, 0, 0, "Woolen Winter Heavy Coats", "Thick warm winter jackets and overcoats in excellent condition", 25, "GOOD", "COLLECTED"},
                    {0, 1, 0, "Hand-knitted Wool Scarves & Beanies", "Assorted woolen accessories for cold weather", 40, "NEW", "COLLECTED"},
                    {1, 1, 1, "Classic Illustrated Fairy Tales Boxset", "Hardcover collection of timeless children's illustrated storybooks", 30, "NEW", "COLLECTED"},
                    {1, 2, 2, "High School Biology & Physics Textbooks", "Grade 11 and 12 science curriculum textbooks with lab guides", 50, "GOOD", "COLLECTED"},
                    {0, 3, 3, "Men's Cotton Flannel Button-down Shirts", "Clean washed warm cotton shirts in sizes M and L", 35, "GOOD", "COLLECTED"},
                    {2, 4, 4, "Women's Embroidered Tunics & Kurtas", "Festive and casual ethnic wear with minimal wear", 20, "GOOD", "COLLECTED"},
                    {1, 0, 1, "Middle School Adventure Novel Collection", "Harry Potter and Percy Jackson paperbacks in readable condition", 15, "WORN", "PENDING"},
                    {0, 2, 3, "Denim Jeans & Cargo Pants", "Durable sturdy jeans for work and casual use", 22, "GOOD", "PENDING"},
                    {1, 3, 2, "Mathematics Olympiad Practice Booklets", "Geometry, Algebra, and Problem Solving workbooks with answer keys", 18, "GOOD", "COLLECTED"},
                    {2, 1, 0, "Thermal Undershirts & Thermal Bottoms", "Sealed pack of thermal innerwear suitable for young adults", 28, "NEW", "DISTRIBUTED"}
            };

            for (Object[] d : itemsData) {
                int driveIdx = Math.min((int) d[0], drives.size() - 1);
                int donorIdx = Math.min((int) d[1], donors.size() - 1);
                int catIdx = Math.min((int) d[2], categories.size() - 1);

                DonatedItem item = new DonatedItem();
                item.setDrive(drives.get(driveIdx));
                item.setDonor(donors.get(donorIdx));
                item.setCategory(categories.get(catIdx));
                item.setItemName((String) d[3]);
                item.setDescription((String) d[4]);
                item.setQuantity((Integer) d[5]);
                item.setCondition((String) d[6]);
                item.setStatus((String) d[7]);
                if (!"PENDING".equals(item.getStatus())) {
                    item.setCollectionDate(LocalDate.now().minusDays(5));
                }
                items.add(itemRepository.save(item));
            }
        } else {
            items = itemRepository.findAll();
        }

        // 7. Seed Sample Distributions if empty
        if (distributionRepository.count() == 0 && items.size() >= 5 && recipients.size() >= 3) {
            // Distribute 15 coats to Sunrise Night Shelter
            Distribution dist1 = new Distribution();
            dist1.setItem(items.get(0));
            dist1.setRecipient(recipients.get(1));
            dist1.setQuantity(15);
            dist1.setDistributionDate(LocalDate.now().minusDays(3));
            dist1.setNotes("Delivered to night shelter intake coordinator for immediate distribution to unsheltered residents.");
            dist1.setDistributedBy("System Administrator");
            dist1.setAdmin(defaultAdmin);
            distributionRepository.save(dist1);

            // Distribute 20 children's books to Hope Horizon Orphanage
            Distribution dist2 = new Distribution();
            dist2.setItem(items.get(2));
            dist2.setRecipient(recipients.get(0));
            dist2.setQuantity(20);
            dist2.setDistributionDate(LocalDate.now().minusDays(2));
            dist2.setNotes("Added to children's bedtime reading library and reading corner.");
            dist2.setDistributedBy("System Administrator");
            dist2.setAdmin(defaultAdmin);
            distributionRepository.save(dist2);

            // Distribute 25 science textbooks to Bright Minds Rural School
            Distribution dist3 = new Distribution();
            dist3.setItem(items.get(3));
            dist3.setRecipient(recipients.get(2));
            dist3.setQuantity(25);
            dist3.setDistributionDate(LocalDate.now().minusDays(1));
            dist3.setNotes("Distributed directly to 10th and 11th grade scholarship students.");
            dist3.setDistributedBy("System Administrator");
            dist3.setAdmin(defaultAdmin);
            distributionRepository.save(dist3);

            // Distribute item 9 (Thermal innerwear - 28 quantity, full distribution)
            if (items.size() > 9) {
                Distribution dist4 = new Distribution();
                dist4.setItem(items.get(9));
                dist4.setRecipient(recipients.get(1));
                dist4.setQuantity(28);
                dist4.setDistributionDate(LocalDate.now().minusDays(1));
                dist4.setNotes("Fully distributed all 28 packs during cold snap emergency relief drive.");
                dist4.setDistributedBy("System Administrator");
                dist4.setAdmin(defaultAdmin);
                distributionRepository.save(dist4);
            }
        }
    }
}
