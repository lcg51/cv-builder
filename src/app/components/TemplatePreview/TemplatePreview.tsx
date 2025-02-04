'use client';
import React from 'react';
import './TemplatePreview.css';

export const TemplatePreview = () => {
	return (
		<section id="cv-preview" className="">
			<div className="cv-wrapper">
				<div className="cv p-14 items-center flex flex-col justify-center bg-secondary">
					<div className="cv-header w-full">
						<div className="cv-header__wrapper">
							<div className="cv-header__text">P | S</div>
							<div>
								<div className="name-title">Pepe Status</div>
							</div>
							<div className="header-role">
								<div className="header-role--bar"></div>
								<div className="click-to-edit-wrapper">
									<div className="header-role--title">Engineer</div>
								</div>
								<div className="header-role--bar"></div>
							</div>
							<div className="header-icons">
								<div className="header-icons__item">
									<div className="">{/* <MapIcon /> */}</div>
									<div>
										<div className="header-icons__item--text">Madrid, 28008, Spain</div>
									</div>
								</div>
								<div className="header-icons__item">
									<div className="">{/* <PhoneIcon /> */}</div>
									<div>
										<div className="header-icons__item--text">652745321</div>
									</div>
								</div>
								<div className="header-icons__item">
									<div className="">{/* <MailIcon /> */}</div>
									<div>
										<div className="header-icons__item--text">pepe.status@gmail.com</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="flex">
						<div className="LeftColumn-sc-fvgclz-15 left-column">
							<div className="image-wrapper">
								{/* <img src={picture} alt="profile-picture" className="image" /> */}
							</div>
							<div id="PROFESSIONAL_SUMMARY" className="janQsy jcDrNn">
								<div className="jgHnCq bdkegh">
									<div className="section-title">
										<span> ABOUT ME </span>
									</div>
									<div className="dvqVRL">
										<div className="janQsy">
											<div>
												<div className="about-me__description">
													<div className="hMKVdI">
														<div className="UnbreakableView-sc-g0hv7p-0">
															<div>
																Lorem ipsum dolor sit amet, consectetur adipiscing elit.
																Sed quis quam in odio tincidunt fermentum. Nam auctor,
																nisl.
															</div>
														</div>
														<div className="UnbreakableView-sc-g0hv7p-0">
															<div>
																Lorem ipsum dolor sit amet, consectetur adipiscing elit.
																Sed quis quam in odio tincidunt fermentum. Nam auctor,
																nisl.
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div id="EDUCATION-block" className="jcDrNn">
								<div className="section-title">
									<span> EDUCATION </span>
								</div>
								<div className="education">
									<div className="dZuYuB">
										<div>
											<span className="education_degree">Engineering Degree</span>
										</div>
										<div>
											<div className="education__university">University of Winsconsing</div>
										</div>
									</div>
								</div>
							</div>
							<div id="SOCIAL_LINKS-block" className="enCnDQ jcDrNn">
								<div className="jgHnCq fmxcqb">
									<div className="section-title">
										<span> LINKS </span>
									</div>
									<div className="links-section">
										<div className="links-section__item">
											<div className="links-section__name">LinkedIn:</div>
											<a href="https://www.linkedin.com/" className="links-section__link">
												MyLinkedIn
											</a>
										</div>
										<div className="links-section__item">
											<div className="links-section__name">Github:</div>
											<a href="https://github.com/" className="links-section__link">
												My github
											</a>
										</div>
									</div>
								</div>
							</div>
							<div id="LANGUAGES-block" className="janQsy jcDrNn">
								<div>
									<div className="section-title">
										<span> LANGUAGES </span>
									</div>
									<div className="languages">
										<div className="language-item">
											<div className="language-item__name">English</div>
											<div>
												<div className="bar-container">
													<div className="bar-container__progress bar-container__progress-80"></div>
												</div>
											</div>
										</div>
										<div className="language-item">
											<div className="language-item__name">Spanish</div>
											<div>
												<div className="bar-container">
													<div className="bar-container__progress bar-container__progress-100"></div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="RightColumn table-cell">
							<div id="EMPLOYMENT-block">
								<div className="section-title">
									<div>WORK EXPERIENCE</div>
								</div>
								<div className="∫dvqVRL">
									<div className="enCnDQ">
										<div className="dZuYuB cmdikB">
											<div className="Column-sc-3wzo5k-6 igMrOZ">
												<div className="">
													<span> Company 1 </span>
												</div>
												<div className="work-experience__time">
													<div>
														<span>2022&nbsp;-&nbsp;Present </span>
													</div>
													<div>
														<span> Madrid </span>
													</div>
												</div>
											</div>
											<div className="experience-item">
												<div className="work-experience__role">Frontend Engineer</div>
												<div className="work-experience__role-description">
													<span>
														Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel
														quae at impedit! Aperiam, hic? Commodi cupiditate rem odio
														consequatur consectetur expedita dolore quibusdam, amet eum
														impedit fuga, autem, dolorum nisi.
													</span>
												</div>
											</div>
										</div>
									</div>
									<div className="enCnDQ">
										<div className="dZuYuB cmdikB">
											<div className="Column-sc-3wzo5k-6 igMrOZ">
												<div className="">
													<span> Companty 2 </span>
												</div>
												<div className="work-experience__time">
													<div>
														<span> 2018&nbsp;-&nbsp;2022 </span>
													</div>
													<div>
														<span> Madrid </span>
													</div>
												</div>
											</div>
											<div className="experience-item">
												<div className="work-experience__role">Frontend Engineer</div>
												<div className="work-experience__role-description">
													<span>
														Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel
														quae at impedit! Aperiam, hic? Commodi cupiditate rem odio
														consequatur consectetur expedita dolore quibusdam, amet eum
														impedit fuga, autem, dolorum nisi.
													</span>
												</div>
											</div>
										</div>
									</div>
									<div className="enCnDQ">
										<div className="dZuYuB cmdikB">
											<div className="Column-sc-3wzo5k-6 igMrOZ">
												<div className="">
													<span> Company 3 </span>
												</div>
												<div className="work-experience__time">
													<div>
														<span> 2016&nbsp;-&nbsp;2018 </span>
													</div>
													<div>
														<span> Barcelona </span>
													</div>
												</div>
											</div>
											<div className="experience-item">
												<div className="work-experience__role">Frontend Developer</div>
												<div className="work-experience__role-description">
													<span>
														Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel
														quae at impedit! Aperiam, hic? Commodi cupiditate rem odio
														consequatur consectetur expedita dolore quibusdam, amet eum
														impedit fuga, autem, dolorum nisi.
													</span>
												</div>
											</div>
										</div>
									</div>
									<div className="enCnDQ">
										<div className="dZuYuB cmdikB">
											<div className="Column-sc-3wzo5k-6 igMrOZ">
												<div className="">
													<span> Company 4 </span>
												</div>
												<div className="work-experience__time">
													<div>
														<span> 2016&nbsp;-&nbsp;2016 </span>
													</div>
													<div>
														<span> Alicante </span>
													</div>
												</div>
											</div>
											<div className="experience-item">
												<div className="work-experience__role">Full Stack developer junior</div>
												<div className="work-experience__role-description">
													<span>
														Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel
														quae at impedit! Aperiam, hic? Commodi cupiditate rem odio
														consequatur consectetur expedita dolore quibusdam, amet eum
														impedit fuga, autem, dolorum nisi.
													</span>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div id="SKILLS-block">
								<div className="section-title">
									<div>Skills</div>
								</div>
								<div className="skills-container">
									<div className="skills-container__paragraph">
										<span className="skills-container--bold">FE skills:</span>
										Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel quae at impedit!
										Aperiam, hic? Commodi cupiditate rem odio consequatur consectetur expedita
										dolore quibusdam, amet eum impedit fuga, autem, dolorum nisi.
									</div>
									<div className="skills-container__paragraph">
										<span className="skills-container--bold">BE skills:</span> Lorem ipsum dolor sit
										amet consectetur adipisicing elit. Vel quae at impedit! Aperiam, hic? Commodi
										cupiditate rem odio consequatur consectetur expedita dolore quibusdam, amet eum
										impedit fuga, autem, dolorum nisi.
									</div>
									<div className="skills-container__paragraph">
										Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel quae at impedit!
										Aperiam, hic? Commodi cupiditate rem odio consequatur consectetur expedita
										dolore quibusdam, amet eum impedit fuga, autem, dolorum nisi.
									</div>
									<div className="skills-container__paragraph">
										Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel quae at impedit!
										Aperiam, hic? Commodi cupiditate rem odio consequatur consectetur expedita
										dolore quibusdam, amet eum impedit fuga, autem, dolorum nisi.
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};
