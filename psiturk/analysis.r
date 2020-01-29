library(tidyverse)
library(estimatr)
library(ggplot2)
library(readr)

parsed_trials <- read_csv("parsed_trials.csv")
parsed_trials <- parsed_trials %>%
  mutate(answer = dot <= 4,
         correct = (Response == answer))


# subject screening

good_subjects <- parsed_trials %>%
  group_by(ID) %>%
  summarise(avg_acc = mean(correct),
            n = n(),
            acc_se = sd(correct)/sqrt(n),
            passed = (avg_acc - acc_se) > 0.5) %>%
  filter(passed)

good_subjects_data <- parsed_trials %>%
  filter(ID %in% good_subjects$ID)


# performance
acc_summary <- mean(good_subjects_data$correct)


across_subjects <-good_subjects_data %>%
  group_by(ID) %>%
  mutate(z_rating = scale(Rating)) %>%
  group_by(scene) %>%
  summarise(avg_acc = mean(correct),
            avg_rating = mean(Rating),
            avg_z_rating = mean(z_rating),
            spring = mean(spring),
            sigma_w = mean(sigma_w),
            n = n(),
            se = sd(correct)/sqrt(n))

across_subjects %>%
  ggplot(aes(x=avg_acc)) +
  geom_histogram(bins = 10) +
  xlab("Average Accuracy") +
  ggtitle("Subject perfomance across trials")


spring_sigma_w_grid <- good_subjects_data %>%
  group_by(ID) %>%
  mutate(z_rating = scale(Rating)) %>%
  group_by(spring, sigma_w) %>%
  summarise(avg_acc = mean(correct),
            avg_z_diff = mean(z_rating),
            avg_diff = mean(Rating),
            n = n(),
            se = sd(correct)/sqrt(n))

png("output/human_acc.png", width = 800, height = 600)
spring_sigma_w_grid %>%
  ggplot(aes(x = spring, y = sigma_w, fill = avg_acc)) +
  geom_tile() +
  labs(fill = "Avg Acc") + 
  scale_fill_gradient(low = "#0072B2", high = "white")  +
  ggtitle("Average Accuracy across parameters")
dev.off()

png("output/human_diff.png", width = 800, height = 600)
spring_sigma_w_grid %>%
  ggplot(aes(x = spring, y = sigma_w, fill = avg_z_diff)) +
  scale_fill_gradient(low = "white", high = "#D55E00")  +
  geom_tile() +
  labs(fill = "Avg Diff (Z)") +
  ggtitle("Average Z-Difficulty across parameters")
dev.off()

model_data <- read_csv("model_accuracy_compute.csv")
model_data$scene <- 0:(nrow(model_data) - 1)

full_data <- merge(across_subjects, model_data)

acc_fit <- with(full_data, 
                lm_robust(avg_acc ~ accuracy))

model_compute_to_human_acc <- with(full_data, 
                lm_robust(avg_acc ~ compute))

png("output/model_compute_to_human_acc.png", width = 800, height = 600)
full_data %>%
  ggplot(aes(y = avg_acc, x = compute)) +
  geom_point() +
  xlab("Model Compute") +
  ylab("Human Accuracy") +
  ggtitle("Model Compute explainin Human Accuracy")
dev.off()

model_acc_to_human_diff <- with(full_data, 
                                lm_robust(avg_z_rating ~ accuracy))

png("output/model_acc_to_human_diff.png", width = 800, height = 600)
full_data %>%
  ggplot(aes(y = avg_z_rating, x = accuracy)) +
  geom_point() +
  xlab("Model Accuracy") +
  ylab("Human Diffuculty (Z)") +
  ggtitle("Model Accuracy explaining Human Difficulty Rating")
dev.off()

png("output/model_human_acc.png", width = 800, height = 600)
full_data %>%
  ggplot(aes(x = accuracy/4, y = avg_acc)) +
  geom_point() +
  xlab("Model Accuracy") +
  ylab("Human Accuracy") +
  ggtitle("Model vs Human Accuracy")
dev.off()

full_data <- full_data %>%
  mutate(log_compute = log(compute))
diff_fit <- with(full_data, 
                lm_robust(avg_z_rating ~ log_compute))

png("output/model_human_diff.png", width = 800, height = 600)
full_data %>%
  ggplot(aes(x = log_compute, y = avg_z_rating)) +
  geom_point() +
  xlab("Log Model Compute") +
  ylab("Human Difficulty") +
  ggtitle("Model vs Human Difficulty")
dev.off()

png("output/model_acc.png", width = 800, height = 600)
full_data %>%
  ggplot(aes(x = spring, y = sigma_w, fill = accuracy)) +
  geom_tile() +
  labs(fill = "Model Acc") + 
  scale_fill_gradient(low = "#0072B2", high = "white")  +
  ggtitle("Model Accuracy across parameters")
dev.off()

png("output/model_compute.png", width = 800, height = 600)
full_data %>%
  ggplot(aes(x = spring, y = sigma_w, fill = log(compute))) +
  scale_fill_gradient(low = "white", high = "#D55E00")  +
  geom_tile() +
  labs(fill = "Log Model Compute") +
  ggtitle("Model Compute across parameters")
dev.off()


