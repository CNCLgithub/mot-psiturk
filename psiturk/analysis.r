library(tidyverse)
library(estimatr)
library(ggplot2)
library(latex2exp)
library(readr)

# setup

parsed_trials <- read_csv("parsed_trials.csv")
parsed_trials <- parsed_trials %>%
  mutate(answer = dot <= 4,
         correct = (Response == answer))
th <- theme_classic() +
  theme(text = element_text(size = 30),
        axis.text = element_text(size = 30),
        legend.text = element_text(size = 30),
        strip.text = element_text(size = 30),
        plot.title = element_text(hjust = 0.5))
theme_set(th)

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
human_summary <- good_subjects_data %>%
  summarise(
    avg_acc = mean(correct),
    n = n(),
    se_acc = sd(correct) / sqrt(n)
  )
sink("output/human_summary.txt")
print(human_summary)
sink()

acc_summary <- mean(good_subjects_data$correct)
print(acc_summary)

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

png("output/trial_acc_histo.png", width = 800, height = 600)
across_subjects %>%
  ggplot(aes(x=avg_acc)) +
  geom_histogram(bins = 10) +
  xlab("Average Accuracy") +
  ggtitle("Subject perfomance across scenes")
dev.off()

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
  labs(fill = "Avg Acc.") + 
  scale_fill_gradient(low = "#0072B2", high = "white") +
  ggtitle("Human Accuracy across parameters")
dev.off()

png("output/human_diff.png", width = 800, height = 600)
spring_sigma_w_grid %>%
  ggplot(aes(x = spring, y = sigma_w, fill = avg_z_diff)) +
  scale_fill_gradient(low = "white", high = "#D55E00")  +
  geom_tile() +
  labs(fill = "Effort (z)") +
  ggtitle("Human Effort across parameters")
dev.off()


# Human to Human

human_acc_to_human_diff <- with(full_data, 
                               lm_robust(avg_z_rating ~ avg_acc))

sink("output/human_acc_to_human_diff.txt")
print(summary(human_acc_to_human_diff))
sink()

png("output/human_acc_to_human_diff.png", width = 800, height = 600)
full_data %>%
  ggplot(aes(x = accuracy, y = avg_acc)) +
  geom_point(size = 5) +
  stat_smooth(method = "lm_robust") +
  xlab("Human Accuracy") +
  ylab("Human Difficulty") + 
  ggtitle("Human Accuracy vs Human Effort",
          subtitle =TeX(sprintf("$R^2=%0.2f$",human_acc_to_human_diff$r.squared)))

dev.off()

model_data <- read_csv("model_accuracy_compute_early_weighted.csv")
model_data$scene <- 0:(nrow(model_data) - 1)

full_data <- merge(across_subjects, model_data) %>%
  mutate(log_compute = log(compute))

# Explaining human accuracy
model_acc_to_human_acc <- with(full_data, 
                lm_robust(avg_acc ~ accuracy))
sink("output/model_acc_to_human_acc.txt")
print(summary(model_acc_to_human_acc))
sink()

png("output/model_acc_to_human_acc.png", width = 800, height = 600)
full_data %>%
  ggplot(aes(x = accuracy, y = avg_acc)) +
  geom_point(size = 5) +
  stat_smooth(method = "lm_robust") +
  xlab("Model Accuracy") +
  ylab("Human Accuracy") +
  ggtitle("Model Accuracy vs Human Accuracy",
          subtitle =TeX(sprintf("$R^2=%0.2f$",model_acc_to_human_acc$r.squared)))
dev.off()

model_compute_to_human_acc <- with(full_data, 
                lm_robust(avg_acc ~ log_compute))
sink("output/model_compute_to_human_acc.txt")
print(summary(model_compute_to_human_acc))
sink()

png("output/model_compute_to_human_acc.png", width = 800, height = 600)
full_data %>%
  ggplot(aes(y = avg_acc, x = log_compute)) +
  geom_point(size = 5) +
  stat_smooth(method = "lm_robust") +
  xlab("Log Model Compute") +
  ylab("Avg. Human Accuracy") +
  ggtitle("Model Compute vs. Human Accuracy",
          subtitle =TeX(sprintf("$R^2=%0.2f$",model_compute_to_human_acc$r.squared)))
dev.off()

# Explaining Human Difficulty Rating

model_acc_to_human_diff <- with(full_data, 
                                lm_robust(avg_z_rating ~ accuracy))
sink("output/model_acc_to_human_diff.txt")
print(summary(model_acc_to_human_diff))
sink()

png("output/model_acc_to_human_diff.png", width = 800, height = 600)
full_data %>%
  ggplot(aes(y = avg_z_rating, x = accuracy)) +
  geom_point(size = 5) +
  stat_smooth(method = "lm_robust") +
  xlab("Model Accuracy") +
  ylab("Human Effort (z-scored)") +
  ggtitle("Model Accuracy vs. Human Effort",
          subtitle =TeX(sprintf("$R^2=%0.2f$",model_acc_to_human_diff$r.squared)))
    
dev.off()


model_compute_to_human_diff <- with(full_data, 
                                       lm_robust(avg_z_rating ~ log_compute))
sink("output/model_compute_to_human_diff.txt")
print(summary(model_compute_to_human_diff))
sink()

png("output/model_compute_to_human_diff.png", width = 800, height = 600)
full_data %>%
  ggplot(aes(x = log_compute, y = avg_z_rating)) +
  geom_point(size = 5) +
  stat_smooth(method = "lm_robust") +
  xlab("Log Model Compute") +
  ylab("Human Effort (z-scored)") +
  ggtitle("Model Compute vs. Human Effort",
          subtitle =TeX(sprintf("$R^2=%0.2f$",model_compute_to_human_diff$r.squared)))
dev.off()

# Residualized fit

acc_to_compute = with(full_data,
                      lm_robust(log_compute ~ accuracy))
sink("output/acc_to_compute.txt")
print(summary(acc_to_compute))
sink()

png("output/acc_to_compute", width = 800, height = 600)
full_data %>%
  ggplot(aes(x = accuracy, y = log_compute)) +
  geom_point(size = 5) +
  stat_smooth(method = "lm_robust") +
  ylab("Log Model Compute") +
  xlab("Model Acc.") +
  ggtitle("Model Accuracy vs. Model Compute",
          subtitle =TeX(sprintf("$R^2=%0.2f$",acc_to_compute$r.squared)))
dev.off()

res_data <- full_data %>%
  mutate(
    res_log_compute = log_compute - acc_to_compute$fitted.values,
    res_avg_z_rating = avg_z_rating - model_acc_to_human_diff$fitted.values
  )


res_model_compute_to_human_diff <- with(res_data,
                                        lm_robust(res_avg_z_rating ~ res_log_compute))

# sink("output/res_model_compute_to_human_diff.txt")
print(summary(res_model_compute_to_human_diff))
# sink()


res_2sls_fit <- with(full_data,
                     iv_robust(avg_z_rating ~ log_compute | accuracy))
sink("output/res_model_compute_to_human_diff.txt")
print(summary(res_2sls_fit))
sink()


png("output/res_model_compute_to_human_diff.png", width = 800, height = 600)
res_data %>%
  ggplot(aes(x = res_log_compute, y = res_avg_z_rating)) +
  geom_point(size = 5) +
  stat_smooth(method = "lm_robust") +
  xlab("Residualized Log Model Compute") +
  ylab("Residualized Human Effort") +
  ggtitle("Res. Model Compute vs. Res. Human Effort",
          subtitle =TeX(sprintf("$R^2=%0.2f$",res_2sls_fit$r.squared)))
dev.off()


png("output/res_model_compute_to_human_diff_sanity.png", width = 800, height = 600)
res_data %>%
  ggplot(aes(x = log_compute, y = avg_z_rating, color = accuracy)) +
  geom_point(size = 5) +
  stat_smooth(method = "lm_robust") +
  scale_color_gradient(low = "#0072B2", high = "white")  +
  xlab("Log Model Compute") +
  ylab("Human Difficulty") +
  ggtitle("Human Rating explained by Compute")
dev.off()


# Model Specific analysis

print(summarize(full_data,
                mc = mean(compute),
                macc = mean(accuracy)))

png("output/model_acc.png", width = 800, height = 600)
full_data %>%
  ggplot(aes(x = spring, y = sigma_w, fill = accuracy)) +
  geom_tile() +
  labs(fill = "Model Acc") + 
  scale_fill_gradient(low = "#0072B2", high = "white") +
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

# Bar plot across models
model_data <- model_data %>%
  mutate(model = "Attention")
accuracy_compute_no_rejuv_avg <- read_csv("accuracy_compute_no_rejuv_avg.csv") %>%
  mutate(model = "Total Avg", scene = trial - 1)
accuracy_compute_no_rejuv_trial <- read_csv("accuracy_compute_no_rejuv_trial.csv") %>%
  mutate(model = "Trial Avg", scene = trial - 1)
accuracy_compute_no_rejuv_base <- read_csv("accuracy_compute_no_rejuv_base.csv") %>%
  mutate(model = "Base", scene = trial - 1)

all_model_data <- bind_rows(
  model_data,
  accuracy_compute_no_rejuv_avg,
  accuracy_compute_no_rejuv_trial,
  accuracy_compute_no_rejuv_base,
                        ) %>%
  mutate(log_compute = log(compute))
png("output/model_performance_exp0.png", width = 800, height = 600)
all_model_data %>%
  group_by(model) %>%
  summarise(avg_acc = mean(accuracy),
            n = n(),
            se = sd(accuracy) / sqrt(n),
            conf.low = avg_acc - 1.96*se,
            conf.high = avg_acc + 1.96*se) %>% 
  ggplot(aes(model, avg_acc, fill = model)) + 
  geom_col(position = "dodge", show.legend = FALSE) +
  geom_errorbar(aes(ymin = conf.low, ymax = conf.high), position = "dodge") +
  xlab("") +
  ylab("Average Accuracy") +
  coord_cartesian(ylim = c(0.5, 1)) +
  ggtitle("Accuracy across Models")
dev.off()


## Model correlations
base_fit <- all_model_data %>%
  filter(model == "Base") %>%
  merge(across_subjects, .) %>%
  with(.,
       lm_robust(avg_z_rating ~ accuracy))
print(summary(base_fit))

total_avg_fit <- all_model_data %>%
  filter(model == "Total Avg") %>%
  merge(across_subjects, .) %>%
  with(.,
       lm_robust(avg_z_rating ~ accuracy))
print(summary(total_avg_fit))

trial_avg_fit <- all_model_data %>%
  filter(model == "Trial Avg") %>%
  merge(across_subjects, .) %>%
  with(.,
       lm_robust(avg_z_rating ~ accuracy))
print(summary(trial_avg_fit))

model_r2 <- data.frame(
  model = c("Base", "Total Avg", "Trial Avg", "Attention"),
  r2 = c(base_fit$r.squared,
         total_avg_fit$r.squared,
         trial_avg_fit$r.squared,
         model_acc_to_human_diff$r.squared)
)
png("output/model_r-squared_exp0.png", width = 800, height = 600)
model_r2 %>%
  ggplot(aes(model, r2, fill = model)) + 
  geom_col(show.legend = FALSE) + 
  xlab("") +
  ylab("R-Squared") +
  coord_cartesian(ylim = c(0, 1)) +
  ggtitle("R-Squared across Models")
dev.off()


loc_error_no_rejuv_avg <- read_csv("loc_error_no_rejuv_avg.csv") %>%
  mutate(model = "Total Avg")
loc_error_rejuv <- read_csv("loc_error_rejuv.csv") %>%
  mutate(model = "Attention")
loc_error_no_rejuv_base <- read_csv("loc_error_no_rejuv_base.csv") %>%
  mutate(model = "Base")
loc_error_no_rejuv_trial <- read_csv("loc_error_no_rejuv_trial.csv") %>%
  mutate(model = "Trial Avg")

bsci <- function(x,B,ci){
  bstrap <- c()
  for (i in 1:B){
    bstrap <- c(bstrap,mean(sample(x,length(x),replace=T)))
  }
  ret <- quantile(bstrap,ci)
}



loc_error <- rbind(loc_error_no_rejuv_avg, 
                   loc_error_rejuv,
                   loc_error_no_rejuv_base,
                   loc_error_no_rejuv_trial) %>%
  group_by(model, distances_nd) %>%
  summarise(
    mu = mean(localization_error),
    n = n(),
    conf.low = bsci(localization_error, 1000, 0.025),
    conf.high = bsci(localization_error, 1000, 0.975)

  )

png("output/model_loc_error.png", width = 800, height = 600)
loc_error %>%
  ggplot(aes(x = distances_nd, y = mu, color = model)) +
  geom_line() +
  geom_point() + 
  geom_linerange(aes(ymin = conf.low, ymax = conf.high)) +
  xlab("NN Dis. (pixels)") +
  ylab("Avg. Loc. Error") +
  ggtitle("Loc. Error vs Nearest Neighbor")
dev.off()

